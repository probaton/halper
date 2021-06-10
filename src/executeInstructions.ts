import ora from 'ora';

import { enumerateCommands, traverseObject, parseHelpText } from './helpers/parsers';
import { getHalpers, getArgValue } from './helpers/halpers';

import writeFile from './helpers/writeFile';

/* @indexedOptions is an ordered array of all unmarked options passed to halp, the first of which is the command itself
 * E.g. halp first-indexed-option "Second indexed option'" => [ "first-indexed-option", "Second indexed option ]
 * @labeledOptions is an object whose key/value pairs represent all labeled options passed to the command
 * E.g. halp command -o "I'm a labeled option" => { o: "I'm a labeled option" }
 */
export default async function executeInstructions(indexedOptions: Array<string | number>, labeledOptions: Record<string, string | boolean>) {
  const halpers = getHalpers();
  const halper = halpers.find(action => action.command == indexedOptions[0]);

  if (!indexedOptions[0]) {
    throw new Error(`Available halp commands are ${enumerateCommands(halpers)}\n\nTry halp <command> --help for a more detailed description of a specific command.`);
  }

  if (!halper) {
    throw new Error(`<${indexedOptions[0]}> is not a halp command. Available options are${enumerateCommands(halpers)}\n\nFor more information on each command, try "halp <command> --help"`);
  }

  if (labeledOptions.help || labeledOptions.h) {
    return parseHelpText(halper);
  }

  const spinner = ora({ text: halper.spinnerText || 'Processing', color: 'magenta' }).start();

  const args = !halper.args ? [] : halper.args.map(arg => {
    const value = getArgValue(arg.flag, indexedOptions, labeledOptions);
    if (!value && arg.requiredMessage) {
      spinner.stop();
      throw new Error(arg.requiredMessage);
    }
    return value || arg.default;
  });

  try {
    let output = await halper.action(...args);

    if (labeledOptions.traverse) {
      if (typeof labeledOptions.traverse != 'string') {
        throw new Error('--traverse requires a string parameter');
      }
      output = traverseObject(labeledOptions.traverse, output);
    }

    if (labeledOptions.stringify) {
      output = JSON.stringify(output, undefined, 2);
    }

    if (labeledOptions.w) {
      const fileName = typeof labeledOptions.w == 'string' ? labeledOptions.w : `${halper.command}.txt`;
      return writeFile(fileName, output);
    }

    return output;
  } finally {
    spinner.stop();
  }
}
