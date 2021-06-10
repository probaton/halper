import { executeShellCommand, getRootDirectory } from '../helpers/util';

async function buildHalp() {
  await executeShellCommand(`cd ${getRootDirectory()} && npm run build`);
  return 'Build successful';
}

const halpConfig: IHalper = {
  command: 'build',
  function: buildHalp,
  helpText: 'Recompiles Halpers to process code changes.',
};
export default halpConfig;
