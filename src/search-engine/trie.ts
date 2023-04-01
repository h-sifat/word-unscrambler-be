interface TrieNode_Arg {
  char: string;
  level: number;
  isEndOfWord?: boolean;
  parent?: TrieNode | null;
}

export class TrieNode {
  readonly isEndOfWord: boolean;
  readonly char: string;
  readonly level: number;
  readonly parent: TrieNode | null;
  readonly children: { [id: string]: TrieNode };

  constructor(arg: TrieNode_Arg) {
    const { char, parent = null, isEndOfWord = false, level } = arg;

    this.char = char;
    this.level = level;
    this.children = {};
    this.parent = parent;
    this.isEndOfWord = isEndOfWord;
  }
  hasChild(char: string) {
    return char in this.children;
  }
  addChild(arg: Pick<TrieNode_Arg, "char" | "isEndOfWord">) {
    const { char, isEndOfWord = false } = arg;

    if (char.length !== 1) throw new Error(`Invalid character "${char}".`);

    return (this.children[char] = new TrieNode({
      char,
      isEndOfWord,
      parent: this,
      level: this.level + 1,
    }));
  }
  getChild(char: string) {
    return this.children[char];
  }
}

export class Trie {
  readonly root = new TrieNode({ char: "*", level: 0 });

  #insert(word: string) {
    for (let i = 0, current = this.root; i < word.length; i++) {
      const char = word[i];

      current = current.hasChild(char)
        ? current.getChild(char)
        : current.addChild({ char, isEndOfWord: i === word.length - 1 });
    }
  }

  insertWords(words: string[]) {
    for (let word of words) this.#insert(word);
  }
}
