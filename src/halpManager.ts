import ora from 'ora';
import { ParsedArgs } from './pargs';

export function initiateHalpManager(halper: IHalper, pargs: ParsedArgs) {
  const spinner = ora({ text: halper.spinnerText || 'Processing', color: 'magenta' });

  const halpMan: HalpManager = {
    pargs,
    spinner,
    log: (...toLog) => {
      spinner.stop();
      console.log(...toLog);
      spinner.start();
    },
  };

  (globalThis as any).halpMan = halpMan;
}

interface HalpManager {
  pargs: ParsedArgs;
  spinner: ora.Ora;
  log: (...toLog: any[]) => void;
}

declare global {
  let halpMan: HalpManager;
}
