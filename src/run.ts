#!/usr/bin/env node
import yargs from 'yargs';

import executeInstructions from './executeInstructions';

yargs.help(false);

// Executor is imported and run dynamically to ensure ENV variable is set before conf is generated.
executeInstructions(yargs.argv._, yargs.argv as Record<string, string | boolean>)
  .then(res => console.log(res))
  .catch(e => console.error(e.message));
