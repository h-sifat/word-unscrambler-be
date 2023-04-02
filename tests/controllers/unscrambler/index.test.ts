import { makeMockHttpRequest } from "../../fixture";
import { SearchEngine } from "../../../src/search-engine";
import { makeUnscramblerController } from "../../../src/controllers/unscrambler";

const searchQueryPropName = "q";
const availableWords = Object.freeze(["cart", "cat", "car"]);

const MAX_SEARCH_QUERY_LENGTH = availableWords.reduce(
  (maxLen, word) => (word.length > maxLen ? word.length : maxLen),
  0
);
const searchEngine = new SearchEngine({
  maxWordLength: MAX_SEARCH_QUERY_LENGTH,
});
searchEngine.insertWords([...availableWords]);

const makeGetRequestWithQuery = (query: string) =>
  makeMockHttpRequest({
    method: "get",
    query: { [searchQueryPropName]: query },
  });

const unscramblerController = makeUnscramblerController({
  searchQueryPropName,
  MAX_SEARCH_QUERY_LENGTH,
  searchEngine: searchEngine as any,
});

describe("Validation", () => {
  describe("get", () => {
    it.each([
      {
        request: makeGetRequestWithQuery(""),
        case: "returns error query is empty string",
      },
      {
        request: makeMockHttpRequest({ method: "get", query: {} }),
        case: "returns error query is missing from query string",
      },
      {
        request: makeGetRequestWithQuery(
          "a".repeat(MAX_SEARCH_QUERY_LENGTH + 1)
        ),
        case: `returns error query is greater than MAX_SEARCH_QUERY_LENGTH`,
      },
    ])(`returns error if $case`, async ({ request }) => {
      const { body, statusCode } = await unscramblerController.get(request);

      expect(body).toEqual({
        success: false,
        error: { message: expect.any(String), code: "INVALID_QUERY" },
      });
      expect(statusCode).toBe(400);
    });
  });
});

describe("get", () => {
  it(`returns the found words if query is valid`, async () => {
    const { body } = await unscramblerController.get(
      makeGetRequestWithQuery("cart")
    );

    expect(body.success).toBeTruthy();
    expect((body as any).data.length).toBeGreaterThan(0);
  });
});
