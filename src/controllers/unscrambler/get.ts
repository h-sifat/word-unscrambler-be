import type { SearchEngine } from "../../search-engine";
import type { ControllerMethod } from "../interface";

export interface makeGetResult_Arg {
  searchQueryPropName: string;
  MAX_SEARCH_QUERY_LENGTH: number;
  searchEngine: Pick<SearchEngine, "search">;
}

export function makeGetResult(arg: makeGetResult_Arg): ControllerMethod {
  const { searchEngine, MAX_SEARCH_QUERY_LENGTH, searchQueryPropName } = arg;

  return async function get(request) {
    const searchQuery = (request.query[searchQueryPropName] || "")
      .trim()
      .toLowerCase();

    {
      let message: string = "";

      if (!searchQuery)
        message = `Please provide the "${searchQueryPropName}" in the query.`;
      else if (searchQuery.length > MAX_SEARCH_QUERY_LENGTH)
        message = `Query too long!`;
      else if (!/^[a-z]+$/i.test(searchQuery))
        message = `Query must only consist of alphabetic letters.`;

      if (message)
        return {
          statusCode: 400,
          body: {
            success: false,
            error: { message, code: "INVALID_QUERY" },
          },
        };
    }

    const possibleWords = searchEngine.search(searchQuery);

    return { body: { success: true, data: possibleWords } };
  };
}
