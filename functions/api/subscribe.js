import { handleRequest } from "../../worker.mjs";

export function onRequest({ request, env }) {
  return handleRequest(request, env);
}
