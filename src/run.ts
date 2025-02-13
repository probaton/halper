#!/usr/bin/env node
import executeInstructions from './executeInstructions';

// Executor is imported and run dynamically to ensure ENV variable is set before conf is generated.
executeInstructions(process.argv.slice(2))
  .then(res => console.log(res))
  .catch(e => console.error(e.message));
