import { access, mkdir, readFile, writeFile } from 'fs/promises';

import { getRootDirectory } from '../helpers/util';

// Returns the read cache file from halpers/hardCache/<cacheName> if it exists or undefined if it does not
async function get(cacheName: string): Promise<string | undefined> {
  try {
    const cachedValue = await readFile(`${getRootDirectory()}/hardCache/${cacheName}`, 'utf-8');
    return JSON.parse(cachedValue);
  } catch (e) {
    return undefined;
  }
}

// Writes toCache to halpers/hardCache/<cacheName>
async function set(cacheName: string, toCache: string): Promise<string> {
  const filePath = `${getRootDirectory()}/hardCache`;
  try {
    await access(filePath);
  } catch (e) {
    await mkdir(filePath);
  }
  writeFile(`${filePath}/${cacheName}`, JSON.stringify(toCache, undefined, 2));
  return toCache;
}

/*
 *Overwrites/creates the current cache matching <cacheName> if a value is provided, then returns <value>
 * Returns the current cache if <value> is undefined and a preexisting cache matching <cacheName> is found
 * Returns undefined if no value is provided and no cache matching <cacheName> is found
 */
export default function getHardCached(cacheName: string, value?: string): Promise<string | undefined> {
  return value
    ? set(cacheName, value)
    : get(cacheName);
}