import type { HttpRequest } from "../src/controllers/interface";

export function makeMockHttpRequest(
  req: Partial<HttpRequest> = {}
): HttpRequest {
  return { body: {}, path: "/", query: {}, headers: {}, method: "get", ...req };
}
