import { get } from '../../calls';
import apiKey from '../../../secret/imdbApiKey';

export function callMovieTitle(query: string) {
  const url = `https://imdb-api.com/en/API/SearchTitle/${apiKey}/${query}`;
  return get(url, { errorMessage: 'Movie search failed' });
}

function fillerSpaces(nrOfSpaces: number) {
  let spaces = '';
  for (let spacesToGo = nrOfSpaces; spacesToGo > 0; spacesToGo--) {
    spaces += ' ';
  }
  return spaces;
}

async function findMovieTitle(query: string) {
  const movies = await callMovieTitle(query);
  let maxIdLength = 0;
  movies.results.forEach(movie => maxIdLength = (movie.id.length > maxIdLength) ? movie.id.length : maxIdLength);
  return movies.results.reduce((aggregate, movie) => `${aggregate}\n[${movie.id}]${fillerSpaces(maxIdLength - movie.id.length)} ${movie.title} - ${movie.description}`, '');
}

const halpConfig: IHalper = {
  command: 'find-movie',
  action: findMovieTitle,
  helpText: 'Searches IMDB for movie titles containing the search term',
  spinnerText: 'Searching IMDB',
  args: [
    { flag: 1, helpText: 'search term', requiredMessage: 'Missing search term' },
  ],
};
export default halpConfig;
