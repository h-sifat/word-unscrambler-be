import http from "http";
import { makeInitialRequestHandler, sendJSONResponse } from "./util";

const ALLOWED_BODY_MIME_TYPE = Object.freeze([
  "text/plain",
  "application/json",
]);

const MAX_BODY_LENGTH_IN_BYTE = 5 * 1e6;

const server = http.createServer(
  makeInitialRequestHandler({
    ALLOWED_BODY_MIME_TYPE,
    MAX_BODY_LENGTH_IN_BYTE,
    router(req, res) {
      console.log("new request: ", req.path);

      if (["/index.html", "/"].includes(req.path))
        return res.end(`<h1>Hello world</h1>`);
      if (req.path === "/api")
        return sendJSONResponse({ res, body: { words: ["a", "bat", "cat"] } });
      else {
        res.statusCode = 404;
        res.end(`<h1>Not found!</h1>`);
      }
    },
  })
);

server.listen(3000, () => {
  console.clear();
});
