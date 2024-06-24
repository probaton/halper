function parseFlagText(flag: IHalpArgFlag): string {
  switch (typeof flag) {
    case 'string': return flag.length === 1 ? `-${flag}` : `--${flag}`;
    case 'number': return ` ${flag}`;
    case 'object': return flag.map(parseFlagText).join(',');
  }
}

function parseArgsText(args?: IHalpArg[]): string {
  if (!args || args.length === 0) return '';

  let argsText = '\n\nOptions\n';

  let hasRequiredArgs = false;
  let maxLength = 0;
  const flagTexts: string[] = [];
  for (const arg of args) {
    hasRequiredArgs = hasRequiredArgs || !!(arg.requiredMessage);
    const flagText = `${parseFlagText(arg.flag)}${arg.requiredMessage ? '*' : ''}`;
    maxLength = Math.max(maxLength, flagText.length);
    flagTexts.push(flagText);
  }
      
  if (hasRequiredArgs) {
    argsText += 'Options marked * are required\n';
  }

  for (let i = 0; i < args.length; i++) {
    const spacedFlagText = `${flagTexts[i]}${' '.repeat(maxLength - flagTexts[i].length)}`;
    const defaultText = ('default' in args[i]) ? ` (default: <${args[i].default}>)` : '';
    argsText += `${spacedFlagText} ${args[i].helpText || ''}${defaultText}\n`;
  }

  return argsText;
}

export function parseHelpText(action: IHalper): string {
  if (!action.helpText && !action.args) {
    return `No documentation found for <${action.command}>`;
  }

  let helpText = action.command;
  helpText += action.helpText ? `\n${action.helpText}` : '';
  helpText += parseArgsText(action.args);
  return helpText;
}

export function enumerateCommands(actions: IHalper[]) {
  return actions
    .map(action => `\n- ${action.command}`)
    .sort()
    .reduce((aggregate, action) => `${aggregate}${action}`);
}

export function traverseObject(query: string, object: Record<string, any>) {
  let currentProp = object;
  let propsSoFar = 'object';
  for (const propString of query.split(/[\[\]\.]/).filter(prop => prop != '')) {
    const subProp = currentProp[propString];
    if (subProp == undefined) {
      const altProps = Object.keys(currentProp);
      const errorMessage = typeof currentProp == 'object' && currentProp != null
        ? `${propsSoFar} has no property ${propString}\nAvailable alternatives:\n- ${altProps.reduce((aggregate, alt) => `${aggregate}\n- ${alt}`)}`
        : `${propsSoFar} is not an object\n${propsSoFar} type: ${typeof currentProp}\n${propsSoFar} value: ${currentProp}`;
      throw new Error(errorMessage);
    }
    propsSoFar += `.${propString}`;
    currentProp = subProp;
  }
  return currentProp;
}
