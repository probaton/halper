import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getRootDirectory } from './util';

// Writes fileString to halpers/exports/<fileName>
export default function writeFile(fileName: string, fileString: string) {
  const filePath = `${getRootDirectory()}/exports`;
  !existsSync(filePath) && mkdirSync(filePath);
  writeFileSync(`${filePath}/${fileName}`, fileString);
  return `Output saved to ${filePath}/${fileName}`;
}
