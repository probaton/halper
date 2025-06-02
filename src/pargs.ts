export function parseArgs(cliArgs: string[]): ParsedArgs {
  const pargs: ParsedArgs = { labeled: {}, indexed: [] };
  let previousFlag: string | undefined = undefined;
  for (let i = 0; i < cliArgs.length; i++) {
    const [isFlag, currentValue] = parseArg(cliArgs[i]);

    if (isFlag) {
      if (pargs.labeled[currentValue] || currentValue == previousFlag) {
        throw new Error(`Duplicate CLI argument <${currentValue}>`);
      }
      if (i == cliArgs.length - 1) {
        pargs.labeled[currentValue] = true;
      }
      if (previousFlag) {
        pargs.labeled[previousFlag] = true;
      }
      previousFlag = currentValue;
      continue;
    }

    if (previousFlag) {
      pargs.labeled[previousFlag] = currentValue;
      previousFlag = undefined;
    } else if (currentValue != undefined) {
      if (pargs.command || typeof currentValue != 'string') {
        pargs.indexed.push(currentValue);
      } else {
        pargs.command = currentValue;
      }
    }
  }
  return pargs;
}

function parseArg(cliArg: string): [true, string] | [false, PargValue] {
  if (cliArg == 'true') return [false, true];
  if (cliArg == 'false') return [false, false];
  if (!isNaN(cliArg as any)) return [false, parseInt(cliArg)];
  if (cliArg.startsWith('--')) return [true, cliArg.slice(2)];
  if (cliArg.startsWith('-')) return [true, cliArg.slice(1)];
  return [false, cliArg];
}

export interface ParsedArgs {
  command?: string;
  indexed: PargValue[];
  labeled: Record<string, PargValue>;
}
type PargValue = string | number | boolean;
