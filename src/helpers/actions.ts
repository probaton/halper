import fs from 'fs';

export function getActions(): IHalper[] {
  const filePaths: string[] = [];

  function processDir(path) {
    fs.readdirSync(path).forEach(fileName => {
      const filePath = `${path}/${fileName}`;
      if (fs.statSync(filePath).isDirectory()) {
        processDir(filePath);
      }
      if (fileName.endsWith('.ts') || fileName.endsWith('.js')) {
        filePaths.push(filePath);
      }
    });
  }

  processDir(`${__dirname}/../actions`);
  return filePaths.map(path => require(path).default);
}

export function getArgValue(flag: IHalpArgFlag, indexedOptions: Array<string | number>, labeledOptions: Record<string, string | boolean>): any {
  if (typeof flag === 'number') {
    return indexedOptions[flag];
  }
  if (typeof flag === 'string') {
    return labeledOptions[flag];
  }
  if (Array.isArray(flag)) {
    const flagValues = flag.map(flag => labeledOptions[flag]);
    return flagValues.find(value => value !== undefined);
  }
  throw new Error('Invalid flag type');
}
