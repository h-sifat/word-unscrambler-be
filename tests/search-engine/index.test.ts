import { SearchEngine } from "../../src/search-engine";

let searchEngine: SearchEngine;
const maxWordLength = 10;

beforeEach(() => {
  searchEngine = new SearchEngine({ maxWordLength });
});

describe("Validation/insertWords", () => {
  it.each([
    { words: [""], case: "word is empty string" },
    { words: ["\n\t   "], case: "word only contains only space chars" },
    { words: ["a@#$@"], case: "word contains non-letter chars" },
  ])(`throws error if $case`, ({ words }) => {
    expect(() => {
      searchEngine.insertWords(words);
    }).toThrow();
  });
});

describe("search", () => {
  it(`finds the possible words`, () => {
    const words = Object.freeze([
      "cat",
      "car",
      "Cart",
      "back",
      "bAg",
      "   TAG  ",
      "\n\t  bat   \t",
    ]);
    searchEngine.insertWords([...words]);

    const query = "catbg";
    const expectedResults = Object.freeze(["cat", "bag", "tag", "bat"].sort());
    expect(searchEngine.search(query).sort()).toEqual(expectedResults);
  });
});
