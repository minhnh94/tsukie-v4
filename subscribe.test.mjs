import assert from "node:assert/strict";
import { test } from "node:test";

import { handleRequest, onRequest } from "./functions/api/subscribe.js";

const LIST_UUID = "18871bcb-292b-451c-b3a3-126779440e75";

function dns(body) {
  return Response.json(body);
}

function request(fields = {}) {
  return new Request("https://tsukie.com/api/subscribe", {
    method: "POST",
    body: new URLSearchParams({
      email: "Reader@Example.com",
      l: LIST_UUID,
      nonce: "",
      ...fields,
    }),
  });
}

function rejectWhenAborted(signal, started) {
  started(signal);
  return new Promise((resolve, reject) => {
    signal.addEventListener(
      "abort",
      () => reject(new DOMException("Timed out", "AbortError")),
      { once: true },
    );
  });
}

async function submit(records, options = {}) {
  const dnsCalls = [];
  const listmonkCalls = [];
  const fetcher = async (input, init) => {
    const url = new URL(input);
    if (url.hostname === "cloudflare-dns.com") {
      const type = url.searchParams.get("type");
      dnsCalls.push(type);
      return dns(records[type]);
    }

    listmonkCalls.push({ url: url.toString(), init });
    return new Response(null, { status: options.listmonkStatus ?? 200 });
  };

  const response = await handleRequest(request(options.fields), fetcher);
  return { response, dnsCalls, listmonkCalls };
}

function assertResult(response, expected) {
  assert.equal(response.status, 303);
  assert.equal(
    new URL(response.headers.get("location")).searchParams.get("subscription"),
    expected,
  );
}

test("Pages Function rejects non-POST requests", async () => {
  const response = await onRequest({
    request: new Request("https://tsukie.com/api/subscribe"),
  });

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("normal MX forwards normalized signup to Listmonk", async () => {
  const result = await submit({
    MX: {
      Status: 0,
      Answer: [{ type: 15, data: "10 mail.example.com." }],
    },
  });

  assertResult(result.response, "pending");
  assert.deepEqual(result.dnsCalls, ["MX"]);
  assert.equal(result.listmonkCalls.length, 1);
  assert.equal(
    result.listmonkCalls[0].url,
    "https://listmonk.tsukie.com/api/public/subscription",
  );
  assert.deepEqual(JSON.parse(result.listmonkCalls[0].init.body), {
    email: "Reader@example.com",
    list_uuids: [LIST_UUID],
  });
});

test("null MX rejects without calling Listmonk", async () => {
  const result = await submit({
    MX: { Status: 0, Answer: [{ type: 15, data: "0 ." }] },
  });

  assertResult(result.response, "invalid-domain");
  assert.equal(result.listmonkCalls.length, 0);
});

test("NXDOMAIN rejects without calling Listmonk", async () => {
  const result = await submit({ MX: { Status: 3 } });

  assertResult(result.response, "invalid-domain");
  assert.equal(result.listmonkCalls.length, 0);
});

test("no MX accepts valid implicit-MX A fallback", async () => {
  const result = await submit({
    MX: { Status: 0, Answer: [] },
    A: { Status: 0, Answer: [{ type: 1, data: "192.0.2.10" }] },
    AAAA: { Status: 0, Answer: [] },
  });

  assertResult(result.response, "pending");
  assert.equal(result.listmonkCalls.length, 1);
});

test("no MX accepts valid implicit-MX AAAA fallback", async () => {
  const result = await submit({
    MX: { Status: 0, Answer: [] },
    A: { Status: 0, Answer: [] },
    AAAA: { Status: 0, Answer: [{ type: 28, data: "2001:db8::10" }] },
  });

  assertResult(result.response, "pending");
  assert.equal(result.listmonkCalls.length, 1);
});

test("no MX or address records rejects without calling Listmonk", async () => {
  const result = await submit({
    MX: { Status: 0, Answer: [] },
    A: { Status: 0, Answer: [] },
    AAAA: { Status: 0, Answer: [] },
  });

  assertResult(result.response, "invalid-domain");
  assert.equal(result.listmonkCalls.length, 0);
});

test("resolver timeout aborts request and blocks Listmonk", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  let started;
  const requestStarted = new Promise((resolve) => {
    started = resolve;
  });
  let listmonkCalls = 0;
  const responsePromise = handleRequest(request(), (input, init) => {
    if (new URL(input).hostname === "cloudflare-dns.com") {
      return rejectWhenAborted(init.signal, started);
    }
    listmonkCalls += 1;
    return Promise.resolve(new Response());
  });

  const signal = await requestStarted;
  assert.ok(signal instanceof AbortSignal);
  assert.equal(signal.aborted, false);
  context.mock.timers.tick(3000);
  assert.equal(signal.aborted, true);
  assertResult(await responsePromise, "retry");
  assert.equal(listmonkCalls, 0);
});

test("SERVFAIL blocks signup with retry result", async () => {
  const result = await submit({ MX: { Status: 2 } });

  assertResult(result.response, "retry");
  assert.equal(result.listmonkCalls.length, 0);
});

test("malformed resolver response blocks signup with retry result", async () => {
  const result = await submit({ MX: { Status: 0, Answer: {} } });

  assertResult(result.response, "retry");
  assert.equal(result.listmonkCalls.length, 0);
});

test("Listmonk failure returns controlled error", async () => {
  const result = await submit(
    {
      MX: {
        Status: 0,
        Answer: [{ type: 15, data: "10 mail.example.com." }],
      },
    },
    { listmonkStatus: 503 },
  );

  assertResult(result.response, "error");
  assert.equal(result.listmonkCalls.length, 1);
});

test("Listmonk timeout aborts request and returns controlled error", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  let started;
  const requestStarted = new Promise((resolve) => {
    started = resolve;
  });
  const responsePromise = handleRequest(request(), (input, init) => {
    if (new URL(input).hostname === "cloudflare-dns.com") {
      return Promise.resolve(
        dns({
          Status: 0,
          Answer: [{ type: 15, data: "10 mail.example.com." }],
        }),
      );
    }
    return rejectWhenAborted(init.signal, started);
  });

  const signal = await requestStarted;
  assert.ok(signal instanceof AbortSignal);
  assert.equal(signal.aborted, false);
  context.mock.timers.tick(5000);
  assert.equal(signal.aborted, true);
  assertResult(await responsePromise, "error");
});

test("filled honeypot silently succeeds without external requests", async () => {
  let calls = 0;
  const response = await handleRequest(
    request({ nonce: "bot" }),
    async () => {
      calls += 1;
      return new Response();
    },
  );

  assertResult(response, "pending");
  assert.equal(calls, 0);
});
