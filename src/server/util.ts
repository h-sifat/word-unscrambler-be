import type {
  Query,
  Request,
  Response,
  HTTPRequestListener,
} from "./interface";

export function urlSearchParamsToQuery(
  urlSearchParams: URLSearchParams
): Query {
  const query: Query = {};

  for (const key of urlSearchParams.keys())
    query[key] = <string>urlSearchParams.get(key);

  return query;
}

export function formatPathName(path: string) {
  path = decodeURI(path.trim());

  if (!path) return "/";

  if (!path.startsWith("/")) path = "/" + path;
  if (path.endsWith("/") && path.length !== 1) path = path.slice(0, -1);

  return path;
}

export interface sendJSONResponse_Arg {
  body: any;
  res: Response;
  statusCode?: number;
}

export function sendJSONResponse(arg: sendJSONResponse_Arg) {
  const { body, res, statusCode } = arg;

  if (statusCode) res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export interface makeInitialRequestHandler_Arg {
  MAX_BODY_LENGTH_IN_BYTE: number;
  ALLOWED_BODY_MIME_TYPE: readonly string[];
  router: (req: Request, res: Response) => void;
}

/**
 * This handler parses the url and body and sets it to the modified request
 * object.
 * */
export function makeInitialRequestHandler(
  arg: makeInitialRequestHandler_Arg
): HTTPRequestListener {
  const { MAX_BODY_LENGTH_IN_BYTE, ALLOWED_BODY_MIME_TYPE, router } = arg;

  return (req, res) => {
    const modifiedRequest: Request = req as any;

    {
      const parsedUrl = new URL("http://" + req.headers["host"]! + req.url);
      modifiedRequest.path = formatPathName(parsedUrl.pathname);
      modifiedRequest.query = urlSearchParamsToQuery(parsedUrl.searchParams);
    }

    const contentType = req.headers["content-type"]!;

    if (ALLOWED_BODY_MIME_TYPE.includes(contentType)) {
      let bodyLength = 0;
      const data: string[] = [];

      req.on("data", (chunk) => {
        bodyLength += chunk.length;

        if (bodyLength > MAX_BODY_LENGTH_IN_BYTE) {
          res.statusCode = 413;
          return;
        }

        data.push(chunk.toString());
      });

      req.on("end", () => {
        const stringifiedData = data.join("");

        if (contentType === "application/json")
          try {
            modifiedRequest.body = JSON.parse(stringifiedData);
          } catch (ex) {
            return sendJSONResponse({
              res,
              statusCode: 400,
              body: { message: "Invalid JSON in body." },
            });
          }
        else modifiedRequest.body = stringifiedData;

        // pass request to the router
        router(modifiedRequest, res);
      });
      // pass request to the router
    } else router(modifiedRequest, res);
  };
}
