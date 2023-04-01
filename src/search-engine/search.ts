import type { Trie, TrieNode } from "./trie";

export interface CharSet {
  [char: string]: number;
}

export function stringToCharSet(string: string): CharSet {
  const charSet: CharSet = {};
  for (const char of string)
    if (char in charSet) charSet[char]++;
    else charSet[char] = 1;

  return charSet;
}

interface findWordFromTrie_Arg {
  node: TrieNode;
  charSet: CharSet;
  suggestions: Set<string>;
}

export interface search_Arg {
  trie: Trie;
  query: string;
}

export function search(arg: search_Arg) {
  const { trie, query } = arg;

  const suggestions = new Set<string>();
  findWordsFromTrie({
    suggestions,
    node: trie.root,
    charSet: stringToCharSet(query),
  });

  return [...suggestions];
}

function findWordsFromTrie(arg: findWordFromTrie_Arg) {
  const { node, charSet, suggestions } = arg;

  if (node.isEndOfWord)
    suggestions.add(makeWordByTraversingTrieNodeUpwards({ node }));

  for (const [char, count] of Object.entries(charSet)) {
    if (!count || !node.hasChild(char)) continue;

    const charSetForSubNode = { ...charSet };
    charSetForSubNode[char]--;

    findWordsFromTrie({
      suggestions,
      charSet: charSetForSubNode,
      node: node.getChild(char)!,
    });
  }
}

type makeWordByTraversingTrieNodeUpwards_Arg = Pick<
  findWordFromTrie_Arg,
  "node"
>;

function makeWordByTraversingTrieNodeUpwards(
  arg: makeWordByTraversingTrieNodeUpwards_Arg
) {
  let currentNode: TrieNode | null = arg.node;

  const charArray = new Array(currentNode!.level || 0).fill("");
  let charIndex = charArray.length - 1;

  while (currentNode && currentNode.level !== 0) {
    charArray[charIndex--] = currentNode.char;
    currentNode = currentNode.parent;
  }

  return charArray.join("");
}
