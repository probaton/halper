import { existsSync, mkdirSync } from 'fs';
import { executeShellCommand, getRootDirectory } from '../helpers/util';

export function linkModule(modulePath: string) {
  if (!existsSync(modulePath)) return `Module path ${modulePath} does not exist`;

  const moduleName = modulePath.split('/').pop();
  if (!moduleName) return `Could not determine module name from path ${modulePath}`;

  const modulesFolderPath = `${getRootDirectory()}/src/actions/modules`;
  !existsSync(modulesFolderPath) && mkdirSync(modulesFolderPath);

  executeShellCommand(`ln -s ${modulePath} ${modulesFolderPath}/${moduleName}`);
  return `Module ${moduleName} linked successfully`;
}

const halpConfig: IHalpConfig = {
  command: 'link-module',
  action: linkModule,
  helpText: 'Links an external module by creating a symlink to the modules folder, making its halpers for use.',
  spinnerText: 'Linking module',
  args: [
    { flag: 1, helpText: 'Full path of the external module folder', requiredMessage: 'Missing module path' },
  ],
};
export default halpConfig;
