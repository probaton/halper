
import { enumerateCommands, traverseObject, parseHelpText } from './helpers/parsers';
import { getHalpers, getArgValue } from './helpers/halpers';

import writeFile from './helpers/writeFile';
import { isJson } from './helpers/util';
import { parseArgs } from './pargs';
import { initiateHalpManager } from './halpManager';

export default async function executeInstructions(cliArgs: string[]) {
  const pargs = parseArgs(cliArgs);
  const halpers = getHalpers();
  const halper = halpers.find(action => action.command == pargs.command);

  if (!pargs.command) {
    throw new Error(`Available halp commands are ${enumerateCommands(halpers)}\n\nTry halp <command> --help for a more detailed description of a specific command.`);
  }

  if (!halper) {
    throw new Error(`<${pargs.command}> is not a halp command. Available options are${enumerateCommands(halpers)}\n\nFor more information on each command, try "halp <command> --help"`);
  }

  if (pargs.labeled.help || pargs.labeled.h) {
    return parseHelpText(halper);
  }

  initiateHalpManager(halper, pargs);

  halpMan.spinner.start();

  const flags = ['e', 'h', 'help', 'stringify', 'traverse', 'w', 'write', 'log-call', 'log-args', 'invalidate-cache', ...halper.args?.map(a => a.flag) || []];
  Object.keys(pargs.labeled).forEach(f => {
    if (!flags.includes(f)) halpMan.log(`Unknown flag <${f}>`);
  });

  const args = !halper.args ? [] : halper.args.map(arg => {
    const value = getArgValue(arg.flag, pargs);
    if (value == undefined && arg.requiredMessage) {
      halpMan.spinner.stop();
      throw new Error(arg.requiredMessage);
    }
    if (halpMan.pargs.labeled['log-args']) {
      halpMan.log(`Argument <${arg.flag}> value: ${value}`);
    }
    return value == undefined && arg.default ? arg.default : value;
  });

  try {
    let output = await halper.action(...args);

    if (pargs.labeled.traverse) {
      if (typeof pargs.labeled.traverse != 'string') {
        throw new Error('--traverse requires a string parameter');
      }
      output = traverseObject(pargs.labeled.traverse, output);
    }

    if (pargs.labeled.stringify) {
      output = JSON.stringify(output, undefined, 2);
    }

    const shouldWrite = pargs.labeled.w || pargs.labeled.write;
    if (shouldWrite) {
      const fileName = typeof shouldWrite == 'string'
        ? shouldWrite
        : `${halper.command}.${isJson(output) ? 'json' : 'txt'}`;
      return writeFile(fileName, output);
    }

    return output;
  } finally {
    halpMan.spinner.stop();
  }
}
