import fs from 'fs';

import { getRootDirectory } from '../helpers/util';

function getDictionary(allWords: boolean) {
  const fileName = allWords ? 'words' : 'dictionary';
  return fs.readFileSync(`${getRootDirectory()}/assets/${fileName}.txt`, 'utf-8');
}

export function words(query: string, allWords: boolean, toExclude?: string, toInclude?: string) {
  const regExp = new RegExp(`\n${query}\n`, 'g');
  let matches = (getDictionary(allWords).match(regExp) ?? []) as string[];

  if (toExclude)  {
    const excludeArray = toExclude ? toExclude.split('') : [];
    matches = matches.filter(word => !word.split('').some(letter => excludeArray.includes(letter)));
  }

  if (toInclude)  {
    const includeArray = toInclude ? toInclude.split('') : [];
    matches = matches.filter(w => includeArray.some(l => w.includes(l)));
  }

  if (!matches || matches.length === 0) {
    return `No matches found for ${query}`;
  }
  return matches
    .reduce((aggregate, match) => `${aggregate}${match.substring(0, match.length - 1)}`, '')
    .trim();
}

const halpConfig: IHalper = {
  command: 'words',
  action: words,
  helpText: 'Search the English dictionary',
  args: [
    { flag: 1, helpText: 'Regex search query', requiredMessage: 'Missing search query' },
    { flag: 'a', helpText: 'Search ALL English words instead of just the dictionary', default: false },
    { flag: 'x', helpText: 'Letters to exclude' },
    { flag: 'i', helpText: 'Letters to include' },
  ],
};
export default halpConfig;
