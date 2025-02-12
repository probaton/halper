import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { getRootDirectory } from './util';

// Writes fileString to halpers/exports/<fileName>
export default function writeFile(fileName: string, fileContents: any) {
  const filePath = `${getRootDirectory()}/exports`;
  !existsSync(filePath) && mkdirSync(filePath);
  writeFileSync(`${filePath}/${fileName}`, JSON.stringify(fileContents, undefined, 2));
  return `Output saved to\n${filePath}/${fileName}`;
}
