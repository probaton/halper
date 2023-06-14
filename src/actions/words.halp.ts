import fs from 'fs';

import { getRootDirectory } from '../helpers/util';

function getDictionary(allWords: boolean) {
  const fileName = allWords ? 'words' : 'dictionary';
  return fs.readFileSync(`${getRootDirectory()}/assets/${fileName}.txt`, 'utf-8');
}

export function words(query: string, allWords: boolean, toExclude?: string) {
  const regExp = new RegExp(`\n${query}\n`, 'g');
  const preExcludeMatches = getDictionary(allWords).match(regExp);
  const excludeArray = toExclude ? toExclude.split('') : [];
  const matches = toExclude
    ? preExcludeMatches?.filter(word => !word.split('').some(letter => excludeArray.includes(letter)))
    : preExcludeMatches;
  if (!matches || matches.length === 0) {
    return `No matches found for ${query}`;
  }
  return matches
    .reduce((aggregate, match) => `${aggregate}${match.substring(0, match.length - 1)}`, '')
    .substring(1);
}

const halpConfig: IHalper = {
  command: 'words',
  action: words,
  helpText: 'Search the English dictionary',
  args: [
    { flag: 1, helpText: 'Regex search query', requiredMessage: 'Missing search query' },
    { flag: 'a', helpText: 'Search ALL English words instead of just the dictionary', default: false },
    { flag: 'x', helpText: 'Letters to exclude' },
  ],
};
export default halpConfig;
