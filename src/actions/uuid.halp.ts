import { randomUUID } from 'crypto';

export async function generateUuids(numberOfUuids?: number, returnAsString?: boolean) {
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