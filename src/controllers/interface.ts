export type RequestMethods = "get" | "post" | "patch" | "delete";

export interface HttpRequest {
  body: any;
  path: string;
  method: RequestMethods;
  query: Record<string, string>;
  headers: Record<string, string>;
}

export type Error_Msg_Code = { message: string; code?: string };

export interface HttpResponse {
  body:
    | { success: true; data: any }
    | { success: false; error: Error_Msg_Code };

  statusCode?: number;
  headers?: { "Content-Type": "application/json"; [key: string]: string };
}

export type ControllerMethod = (arg: HttpRequest) => Promise<HttpResponse>;

export type HttpController<availableMethods extends RequestMethods> = Record<
  availableMethods,
  ControllerMethod
>;
