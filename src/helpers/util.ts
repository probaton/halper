import { exec } from 'child_process';
import { promises as fs } from 'fs';

export function generateRandomNumber(numberOfDigits = 6) {
  let factor = 1;
  for (let i = numberOfDigits - 2; i >= 0; i--) {
    factor = factor * 10;
  }
  return Math.floor(factor + Math.random() * (9 * factor));
}

export function getRootDirectory() {
  const path = require.main!.path;
  const charsToSliceOffTheEnd = (path.indexOf('/dist/src') == path.length - 9) ? -9 : -4;
  return path.slice(0, charsToSliceOffTheEnd);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return await (fs.access(filePath)) === undefined;
  } catch (e: any) {
    if (e.code === 'ENOENT') return false;
    throw e;
  }
}

export function executeShellCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (e, stdout, stderr) => {
      if (e) {
        reject(e);
      }
      resolve(stderr || stdout);
    });
  });
}

// Parses and returns the contents of the designated file in the root level secret folder
export function parseSecretFile(fileName: string): Promise<any> {
  try {
    return require(`${getRootDirectory()}/secret/${fileName}`);
  } catch (e: any) {
    if (e?.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Required file ./secret/${fileName} does not exist`);
    } else if (e?.name === 'SyntaxError') {
      throw new Error(`Error parsing required file ./secret/${fileName}: ${e?.message}`);
    } else {
      throw e;
    }
  }
}

export function isJson(input: any): boolean {
  try {
    return typeof input == 'object' && !!(JSON.parse(JSON.stringify(input)));
  } catch (_) {
    return false;
  }
}

export function chunk<T>(array: T[], chunkSize: number): T[][] {
  return array.reduce((a: T[][], _, i) => {
    if (i % chunkSize == 0) {
      a.push(array.slice(i, i + chunkSize));
    }
    return a;
  }, []);
}

export const timer = ms => new Promise(res => setTimeout(res, ms));
