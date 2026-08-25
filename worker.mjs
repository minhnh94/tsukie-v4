const DNS_URL = "https://cloudflare-dns.com/dns-query";
const LISTMONK_URL = "https://listmonk.tsukie.com/api/public/subscription";
const LIST_UUID = "18871bcb-292b-451c-b3a3-126779440e75";
const MAX_FORM_BYTES = 4096;
const DNS_TIMEOUT_MS = 3000;
const LISTMONK_TIMEOUT_MS = 5000;

function redirect(request, result) {
  return Response.redirect(
    new URL(`/subscribe?subscription=${result}`, request.url),
    303,
  );
}

function normalizeDomain(value) {
  if (!value || value.length > 254) return null;

  let parsed;
  try {
    parsed = new URL(`http://${value}/`);
  } catch {
    return null;
  }

  if (
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    return null;
  }

  const domain = parsed.hostname.toLowerCase().replace(/\.$/, "");
  const labels = domain.split(".");
  if (
    !domain ||
    domain.length > 253 ||
    labels.some(
      (label) =>
        label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
    )
  ) {
    return null;
  }

  return domain;
}

function normalizeEmail(value) {
  if (!value) return null;

  const email = value.trim();
  const at = email.indexOf("@");
  if (email.length > 254 || at <= 0 || at !== email.lastIndexOf("@"))
    return null;

  const local = email.slice(0, at);
  const domain = normalizeDomain(email.slice(at + 1));
  if (
    !domain ||
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)
  ) {
    return null;
  }

  return { email: `${local}@${domain}`, domain };
}

async function readSmallForm(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^application\/x-www-form-urlencoded(?:\s*;|$)/i.test(contentType)) {
    throw new Error("Unsupported form encoding");
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_FORM_BYTES) {
    throw new Error("Form too large");
  }

  if (!request.body) return new URLSearchParams();

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;
      if (size > MAX_FORM_BYTES) {
        await reader.cancel();
        throw new Error("Form too large");
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return new URLSearchParams(body);
}

async function queryDns(domain, type, fetcher) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DNS_TIMEOUT_MS);

  try {
    const url = new URL(DNS_URL);
    url.searchParams.set("name", domain);
    url.searchParams.set("type", type);

    const response = await fetcher(url, {
      headers: { accept: "application/dns-json" },
      signal: controller.signal,
    });
    if (!response.ok) return { status: "retry" };

    const result = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !Number.isInteger(result.Status) ||
      result.TC === true ||
      (result.Answer !== undefined && !Array.isArray(result.Answer))
    ) {
      return { status: "retry" };
    }
    if (result.Status === 3) return { status: "nxdomain" };
    if (result.Status !== 0) return { status: "retry" };

    const answers = result.Answer ?? [];
    if (
      answers.some(
        (answer) =>
          !answer ||
          typeof answer !== "object" ||
          !Number.isInteger(answer.type) ||
          typeof answer.data !== "string",
      )
    ) {
      return { status: "retry" };
    }

    return { status: "ok", answers };
  } catch {
    return { status: "retry" };
  } finally {
    clearTimeout(timeout);
  }
}

function mxResult(answers) {
  const records = answers.filter((answer) => answer.type === 15);
  if (!records.length) return "none";

  for (const record of records) {
    const match = /^(\d{1,5})\s+(\S+)$/.exec(record.data.trim());
    if (!match) return "retry";

    const preference = Number(match[1]);
    const exchange = match[2];
    if (preference > 65535) return "retry";
    if (exchange === ".") return preference === 0 ? "invalid-domain" : "retry";
    if (!normalizeDomain(exchange)) return "retry";
  }

  return "valid";
}

function validIpv4(value) {
  const parts = value.split(".");
  return (
    parts.length === 4 &&
    parts.every(
      (part) => /^(?:0|[1-9]\d{0,2})$/.test(part) && Number(part) <= 255,
    )
  );
}

function validIpv6(value) {
  try {
    const hostname = new URL(`http://[${value}]/`).hostname;
    return hostname.startsWith("[") && hostname.endsWith("]");
  } catch {
    return false;
  }
}

function addressResult(query, type) {
  if (query.status === "retry") return "retry";
  if (query.status === "nxdomain") return "none";

  const records = query.answers.filter((answer) => answer.type === type);
  if (!records.length) return "none";

  const isValid = type === 1 ? validIpv4 : validIpv6;
  return records.every((record) => isValid(record.data.trim()))
    ? "valid"
    : "retry";
}

async function checkMailDomain(domain, fetcher) {
  const mx = await queryDns(domain, "MX", fetcher);
  if (mx.status === "nxdomain") return "invalid-domain";
  if (mx.status === "retry") return "retry";

  const mxStatus = mxResult(mx.answers);
  if (mxStatus !== "none") return mxStatus;

  const [a, aaaa] = await Promise.all([
    queryDns(domain, "A", fetcher),
    queryDns(domain, "AAAA", fetcher),
  ]);
  const addressStatuses = [addressResult(a, 1), addressResult(aaaa, 28)];
  if (addressStatuses.includes("valid")) return "valid";
  if (addressStatuses.includes("retry")) return "retry";
  return "invalid-domain";
}

async function subscribe(request, fetcher) {
  let form;
  try {
    form = await readSmallForm(request);
  } catch {
    return redirect(request, "error");
  }

  // Silently accept honeypot submissions so bots cannot probe validation behavior.
  if (form.get("nonce")) return redirect(request, "pending");

  const normalized = normalizeEmail(form.get("email"));
  const lists = form.getAll("l");
  if (!normalized || lists.length !== 1 || lists[0] !== LIST_UUID) {
    return redirect(request, "error");
  }

  const domainStatus = await checkMailDomain(normalized.domain, fetcher);
  if (domainStatus !== "valid") return redirect(request, domainStatus);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LISTMONK_TIMEOUT_MS);
  try {
    const response = await fetcher(LISTMONK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        email: normalized.email,
        list_uuids: lists,
      }),
    });
    return redirect(request, response.ok ? "pending" : "error");
  } catch {
    return redirect(request, "error");
  } finally {
    clearTimeout(timeout);
  }
}

export async function handleRequest(request, env, fetcher = fetch) {
  if (new URL(request.url).pathname !== "/api/subscribe") {
    return env.ASSETS.fetch(request);
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { allow: "POST" },
    });
  }

  return subscribe(request, fetcher);
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
