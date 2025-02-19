import { randomUUID } from 'crypto';

export function generateUuids(): string
export function generateUuids(numberOfUuids: number, returnAsString: false): string[]
export function generateUuids(numberOfUuids: number): string[]
export function generateUuids(numberOfUuids: number, returnAsString: true): string
export function generateUuids(numberOfUuids?: number, returnAsString?: boolean): string | string[] {
  if (!numberOfUuids || numberOfUuids === 1) {
    return randomUUID();
  }

  const uuids: string[] = [];
  for (let i = numberOfUuids; i > 0; i--) {
    uuids.push(randomUUID());
  }

  return returnAsString
    ? uuids.join(',')
    : uuids;
}

const halpConfig = {
  command: 'uuid',
  action: generateUuids,
  helpText: 'Generates random UUIDs',
  spinnerText: 'Generating UUIDs',
  args: [
    { flag: 'n', helpText: 'Number of UUIDs to generate', default: 1 },
    { flag: 't', helpText: 'Return UUIDs as comma-separated string', default: false },
  ],
};
export default halpConfig;
