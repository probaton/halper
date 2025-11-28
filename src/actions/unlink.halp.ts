import { existsSync } from 'fs';
import { executeShellCommand, getRootDirectory } from '../helpers/util';

export function unlinkModule(moduleName: string) {
  const modulePath = `${getRootDirectory()}/src/actions/modules/${moduleName}`;
  if (!existsSync(modulePath)) return `No ${modulePath} folder found`;

  executeShellCommand(`rm ${modulePath}`);
  return `Module ${moduleName} unlinked successfully`;
}

const halpConfig: IHalpConfig = {
  command: 'unlink-module',
  action: unlinkModule,
  helpText: 'Unlinks an external module by deleting the symlink.',
  spinnerText: 'Unlinking module',
  args: [
    { flag: 1, helpText: 'Name of the external module to delete', requiredMessage: 'Missing module name' },
  ],
};
export default halpConfig;
