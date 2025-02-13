import { ParsedArgs } from './pargs';

export function initiateHalpManager(pargs: ParsedArgs) {
  (globalThis as any).halpMan = { pargs } as HalpManager;
}

interface HalpManager {
  pargs: ParsedArgs;
}

declare global {
  let halpMan: HalpManager;
}
