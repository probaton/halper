function parseArgText(arg: HalpArg): string {
  let argText = typeof arg.flag == 'string' ? ` -${arg.flag}` : `  ${arg.flag}`;
  argText += arg.requiredMessage ? '*' : '';
  while (argText.length < 6) {
    argText += ' ';
  }
  argText += arg.helpText || '';
  argText += ('default' in arg) ? ` (default: <${arg.default}>)` : '';
  return argText;
}

export function parseHelpText(action: HalpAction): string {
  if (!action.helpText && !action.args) {
    return `No documentation found for <${action.command}>`;
  }

  let helpText = action.command;
  helpText += action.helpText ? `\n${action.helpText}` : '';

  if (action.args && action.args.length > 0) {
    helpText += '\n\nOptions\n';
    if (action.args.some(arg => arg.requiredMessage)) {
      helpText += 'Options marked * are required\n';
    }
    helpText += action.args
      .map(parseArgText)
      .reduce((aggregate, argText) => `${aggregate}\n${argText}`);
  }
  return helpText;
}

export function enumerateCommands(actions: HalpAction[]) {
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
