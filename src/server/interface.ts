import type http from "http";

export type Query = Record<string, string>;

export interface Request extends http.IncomingMessage {
  body?: any;
  query: Query;
  path: string;
}
export type Response = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};

export type HTTPRequestListener = NonNullable<
  Parameters<typeof http.createServer>[1]
>;
