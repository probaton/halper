import { exec } from 'child_process';

export function generateRandomNumber(numberOfDigits = 6) {
  let factor = 1;
  for (let i = numberOfDigits - 2; i >= 0; i--) {
    factor = factor * 10;
  }
  return Math.floor(factor + Math.random() * (9 * factor));
}

export function generateEmail() {
  return `randocalrissian${new Date().toISOString().replace(/:/g, '.')}@example.com`;
}

export function getRootDirectory() {
  const path = require.main!.path;
  const charsToSliceOffTheEnd = (path.indexOf('/dist/src') == path.length - 9) ? -9 : -4;
  return path.slice(0, charsToSliceOffTheEnd);
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
