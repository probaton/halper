import { get } from '../../calls';
import { parseSecretFile } from '../../helpers/util';

export function callMovieTitle(query: string) {
  const apiKey = parseSecretFile('imdbApiKey.js');
  const url = `https://imdb-api.com/en/API/SearchTitle/${apiKey}/${query}`;
  return get(url, { errorMessage: 'Movie search failed' });
}

async function findMovieTitle(query: string) {
  const { results } = await callMovieTitle(query);
  const maxIdLength = results.reduce((maxIdLength, { id }) => id.length > maxIdLength ? id.length : maxIdLength, 0);
  return results.reduce((aggregate, movie) => {
    const padding = ' '.repeat(maxIdLength - movie.id.length);
    const summary = `${movie.title} - ${movie.description}`;
    return `${aggregate}\n[${movie.id}]${padding} ${summary}`;
  }, '');
}

const halpConfig = {
  command: 'find-movie',
  action: findMovieTitle,
  helpText: 'Searches IMDB for movie titles containing the search term',
  spinnerText: 'Searching IMDB',
  args: [
    { flag: 1, helpText: 'search term', requiredMessage: 'Missing search term' },
  ],
};
export default halpConfig;
