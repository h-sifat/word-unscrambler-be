import { Trie } from "./trie";
import { search } from "./search";

export interface SearchEngine_Arg {
  maxWordLength: number;
}

const VALID_WORD_PATTERN = /^[a-z]+$/;

export class SearchEngine {
  readonly #trie = new Trie();
  readonly #MAX_WORD_LENGTH: number;

  constructor(arg: SearchEngine_Arg) {
    this.#MAX_WORD_LENGTH = arg.maxWordLength;
  }

  insertWords = (words: string[]) => {
    words = words.map((word) => word.trim().toLowerCase());

    words.forEach((word, index) => {
      if (
        !VALID_WORD_PATTERN.test(word) ||
        !word.length ||
        word.length > this.#MAX_WORD_LENGTH
      )
        throw new Error(`Invalid word "${word}" at index ${index}`);
    });

    this.#trie.insertWords(words);
  };

  search = (query: string) => search({ query, trie: this.#trie });
}
