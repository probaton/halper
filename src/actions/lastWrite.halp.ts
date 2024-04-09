import { promises as fs } from 'fs';
import { fileExists, getRootDirectory } from '../helpers/util';

async function lastWrite() {
  const path = `${getRootDirectory()}/exports`;
  const dir = await fileExists(path) && await fs.readdir(path, 'utf-8');

  if (!dir || !dir?.length) return `No files found in ${path}`;

  const fileInfo = await Promise.all(dir.map(async fileName => {
    const filePath = `${path}/${fileName}`;
    const stat = await fs.stat(filePath);
    return { filePath, lastModified: stat.mtimeMs };
  }));

  const lastWrite = fileInfo.sort((a, b) => b.lastModified - a.lastModified)[0];

  const fileContent = fs.readFile(lastWrite.filePath, 'utf-8');
  try {
    return JSON.parse(await fileContent);
  } catch (_e) {
    return fileContent;
  }
}

const halpConfig: IHalper = {
  command: 'last-write',
  action: lastWrite,
  spinnerText: 'Parsing last written file',
  helpText: 'Attempts to parse and print last file written to Halper\'s /exports folder',
};

export default halpConfig;
