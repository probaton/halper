export function addCombos(total: number, addendCount: number) {
  if (addendCount > 9) {
    return 'Max number of addends is 9';
  }

  let highestChecked: number[] | undefined = [];
  for (let i = 1; i <= addendCount; i++) {
    highestChecked.push(i);
  }

  if (addArray(highestChecked) > total) {
    return parseNoCombosMessage(total, addendCount);
  }

  const combos: number[][] = [];
  let current: number[] | undefined = highestChecked;
  while (current && highestChecked) {
    if (addArray(current) === total) {
      combos.push(current);
      highestChecked = highestChecked && incrementAllAddends(highestChecked);
      current = highestChecked;
      continue;
    }

    current = incrementAddends(current);

    if (!current) {
      highestChecked = highestChecked && incrementAllAddends(highestChecked);
      current = highestChecked;
    }
  }

  return combos.length > 0
    ? combos.reduce((comboList, combo) => `${comboList}${combo}\n`, '')
    : parseNoCombosMessage(total, addendCount);
}

function incrementAddends(previousAddends: number[]): number[] | undefined {
  const addends = [...previousAddends];
  for (let i = addends.length - 1; i >= 1; i--) {
    const isNotLastAddendAndCanIncrement = addends[i + 1] && addends[i] + 1 < addends[i + 1];
    const isLastAddendAndCanIncrement = !addends[i + 1] && addends[i] < 9;
    if (isNotLastAddendAndCanIncrement || isLastAddendAndCanIncrement) {
      addends[i]++;
      return addends;
    }
  }
}

function incrementAllAddends(previousAddends: number[]): number[] | undefined {
  const addends = [...previousAddends];
  if (addends[addends.length - 1] < 9) {
    return addends.map(x => x + 1);
  }
}

function addArray(addends: number[]): number {
  return addends.reduce((sum, addend) => sum + addend);
}

function parseNoCombosMessage(total: number, addendCount: number) {
  return `No combination of ${addendCount} numbers add up to ${total}`;
}

const halpConfig = {
  command: 'add-combos',
  action: addCombos,
  helpText: 'Calculates the possible unique combinations of integers that add up to a number',
  spinnerText: 'Calculating possible addends',
  args: [
    { flag: 1, helpText: 'The total sum to add up to', requiredMessage: 'Total sum required' },
    { flag: 2, helpText: 'The number of addends that should add up to the total', requiredMessage: 'Number of addends required' },
  ],
};
export default halpConfig;
