import fs from 'fs';
import { ParsedArgs } from '../pargs';

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

export function getArgValue(flag: IHalpArgFlag, pargs: ParsedArgs): any {
  if (typeof flag === 'number') {
    return pargs.indexed[flag - 1];
  }
  if (typeof flag === 'string') {
    return pargs.labeled[flag];
  }
  if (Array.isArray(flag)) {
    const flagValues = flag.map(flag => pargs.labeled[flag]);
    return flagValues.find(value => value !== undefined);
  }
  throw new Error('Invalid flag type');
}
