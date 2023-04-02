import { HttpController } from "../interface";
import { makeGetResult_Arg, makeGetResult } from "./get";

export type makeUnscramblerController_Arg = {} & makeGetResult_Arg;

export function makeUnscramblerController(
  arg: makeUnscramblerController_Arg
): HttpController<"get"> {
  const { MAX_SEARCH_QUERY_LENGTH, searchEngine, searchQueryPropName } = arg;

  return Object.freeze({
    get: makeGetResult({
      searchEngine,
      searchQueryPropName,
      MAX_SEARCH_QUERY_LENGTH,
    }),
  });
}
