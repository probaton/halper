import fs from 'fs';

export function getHalpers(): IHalper[] {
  const filePaths: string[] = [];

  function processDir(path) {
    fs.readdirSync(path).forEach(fileName => {
      const filePath = `${path}/${fileName}`;
      if (fs.statSync(filePath).isDirectory()) {
        processDir(filePath);
      }
      if (fileName.endsWith('.halp.ts') || fileName.endsWith('.halp.js')) {
        filePaths.push(filePath);
      }
    });
  }

  processDir(`${__dirname}/../actions`);
  const halpers = filePaths.map(path => {
    const halper = require(path).default;
    if (typeof halper.command != 'string' || typeof halper.action != 'function') {
      console.warn(`The halper at ${path} is improperly formatted`);
    }
    return halper;
  });
  return halpers;
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
