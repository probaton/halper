export function addCombos(total: number, addendCount: number, excludedDigitString?: string) {
  if (addendCount > 9) return 'Max number of addends is 9';
  if (addendCount < 2) return 'No one is that bad at counting';

  const excludedDigits = parseExcludedDigits(excludedDigitString);

  const initialDigits: number[] = [];
  for (let i = 0; i < addendCount; i++) {
    initialDigits.push(i + 1);
  }

  const lowest = arrayToNr(initialDigits);
  const highest = arrayToNr(initialDigits.map(d => d + (9 - addendCount)));

  const combos: Set<number> = new Set();
  for (let num = lowest; num <= highest; num++) {
    const digits: number[] = num.toString().split('').map(d => parseInt(d)).sort();
    const digitTotal = digits.reduce((sum, digit) => sum + digit, 0);
    if (digitTotal !== total) continue;

    let containsInvalidDigit = false;
    for (let i = 0; i < digits.length; i++) {
      containsInvalidDigit = excludedDigits.has(digits[i]) || (digits[i + 1] <= digits[i]);
      if (containsInvalidDigit) break;
    }

    if (!containsInvalidDigit) {
      combos.add(arrayToNr(digits));
    }
  }

  return combos.size === 0
    ? `No combination of ${addendCount} digits (excluding ${Array.from(excludedDigits)}) add up to ${total}`
    : Array.from(combos).reduce((result, num) => `${result}${num.toString().split('').join(', ')}\n`, '').trim();
}

function parseExcludedDigits(excludedDigitString?: string): Set<number> {
  const result: Set<number> = new Set([0]);
  if (!excludedDigitString) return result;

  const digitStrings = excludedDigitString.toString().split(',');
  for (const digitString of digitStrings) {
    const digit = parseInt(digitString);
    if (digitString.length !== 1 || isNaN(digit)) {
      throw new Error(`Invalid digit ${digitString} found in excluded digit list`);
    }
    result.add(digit);
  }
  return result;
}

function arrayToNr(array: number[]): number {
  return parseInt(array.join(''));
}

const halpConfig = {
  command: 'add-combos',
  action: addCombos,
  helpText: 'Calculates the possible unique combinations of integers that add up to a number',
  spinnerText: 'Calculating possible addends',
  args: [
    { flag: 1, helpText: 'The total sum to add up to', requiredMessage: 'Total sum required' },
    { flag: 2, helpText: 'The number of addends that should add up to the total', requiredMessage: 'Number of addends required' },
    { flag: 'x', helpText: 'Comma-separated list of digits to exclude' },
  ],
};
export default halpConfig;
