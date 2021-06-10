import { existsSync, mkdirSync, writeFileSync } from 'fs';

// Writes fileString to halpers/exports/<fileName>
export default function writeFile(fileName: string, fileString: string) {
  const filePath = `${__dirname}/../../../exports/`;
  !existsSync(filePath) && mkdirSync(filePath);
  writeFileSync(`${filePath}/${fileName}`, fileString);
  return `Output saved to ${__dirname.substring(0, __dirname.length - 17)}/exports/${fileName}`;
}
