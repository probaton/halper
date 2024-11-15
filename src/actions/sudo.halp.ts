type SudoType = 'combos' | 'c' | 'add' | 'a';
const validOptionString = 'valid options are combos and add';

function sudo(type: SudoType, first?: string, second?: number, third?: string) {
  switch (type) {
    case 'a':
    case 'add': return add(first);
    case 'c':
    case 'combos': return combos(first, second, third);
    default: return `Invalid type ${type}; ${validOptionString}`;
  }
}

function add(toAdd?: string) {
  return toAdd
    ? `${toAdd}`.split(',').reduce((a, x) => a + parseInt(x), 0)
    : 'Missing digit string';
}

function combos(totalString?: string, addendCount?: number, excludedDigitString?: string) {
  const total = parseInt(`${totalString}`);
  if (!total) return `Invalid target total sum ${totalString}`;
  if (!addendCount) return 'Missing target number of digits';
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
    ? `No combination of ${addendCount} digits (excluding ${Array.from(excludedDigits).join(', ')}) add up to ${total}`
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
  command: 'sudo',
  action: sudo,
  helpText: 'Various sudoku utility functions',
  spinnerText: 'Calculating',
  args: [
    { flag: 1, helpText: 'Desired utility; valid options are combos and add', requiredMessage: `Missing utility type; ${validOptionString}` },
    { flag: 2, helpText: 'First input' },
    { flag: 3, helpText: 'Second input' },
    { flag: 4, helpText: 'Third input' },
  ],
};
export default halpConfig;
