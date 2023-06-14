# **Halpers**
A command line interface for TypeScript. Takes care of all the annoying scaffolding involved in writing JavaScript snippets. Just add a new TS file, build the project, and your command is immediately globally available in your terminal. 

# Getting Started
Quick start
```bash
git clone git@github.com:probaton/halper.git && cd halpers/ && npm i && npm run build && npm i -g ./ && halp --help
```

Step by step
```bash
git clone git@github.com:probaton/halper.git            # Download Halpers
cd halpers/                                             # Open directory
npm install                                             # Install dependencies
npm run build                                           # Convert TypeScript to JavaScript
npm i -g ./                                             # Install Halpers as a global command line shortcut
halp --help                                             # List all installed Halpers
```

# Options
## -h/--help
Prints a list of available actions or (more) detailed information on a command, depending on whether a command is included. Command information is derived from the `helpText` values associated with that command, as explained in [next section](#contributing).

## -e
The target environment can be set with the `-e` flag. Valid options are `dev` and `local`. The default is `dev`. E.g. `halp -e local words "cookies"`. This can be useful if a command can be run in different contexts that require a different set of configuration parameters. Configs can be added and edited under `configs/`.

## -w
Running a command with `-w` will write the command output to a file instead of printing it in the console. The flag can either be empty (i.e. `true`), in which case the output will be saved to `exports/<command>.txt`, or you can specify a file name. For example, `-w output.csv` saves the output to `exports/output.csv`.  

## --stringify
Passing `--stringify` will attempt to convert the output of the `halp` command to plain text. Use this to expand `Object` or `Array` items that are automatically truncated by NodeJS. 

## --traverse
If the output of the chosen command is a valid JSON object, the string passed to this flag will be applied to the object as if it were invoked in code. The flag accepts both indices and direct property invocations, as well as chaining. 

### Example
```
// Command without traversal
halp example-command
{
  arrayProp: [{ subObjectProp: 'Hello!' }]
}

// Command with traversal
halp example-command --traverse "arrayProp[0].subObjectProp"
Hello!
```


# Custom Halpers
Halpers was set up to be highly extensible and additions are encouraged. Adding a new command is as easy as adding a new TS file to `src/actions/` and rebuilding the project with `npm run build`. Halpers will automatically import and execute the new command when run, provided the file exports an object that adheres to the schema below. Adding new files to `src/actions/local/` will prevent them from showing up in Git. 
```javascript
// module.exports spec
{
  command: string (required)                    // The command that users should type to execute your action. E.g. 'words'.
  function: () => Promise<string> (required)    // The function to execute. This function should return a Promise that culminates in a string, which is what Halpers will output to stdout.
  helpText: string (optional)                   // The message to be shown when the user calls `halp <command> --help`. 
  spinnerText: string (optional)                // The message shown while the command is being processed. Defaults to 'Processing'.
  args: Argument[] (optional)                   // An array that describes the arguments that are to be passed to the function. Arguments will be passed in the order they are listed here. 
}

// Argument spec
{
  // The command line flag the argument is to be parsed from. 
  // If this is a number, it describes a positional argument. E.g. flag: 1 will pass 'cookies' for the command halp words 'cookies'. 
  // If a string, it will pass the matching flag value. E.g. flag: 't' will pass 'things' for the command halp halp proc -t things.
  flag: string | number (required)
  helpText: string (optional)                   // Adds flag-specific information to the output of `halp <command> --help`.
  requiredMessage: string (optional)            // If set, will error if the argument is missing with the provided message. Supersedes the default property.
  default: any (optional)                       // Value passed if the flag value is left empty. Is superseded by requiredMessage.
}
```

A full type definition of the `HalpAction` that your file should export can be found at `src/IHalper.ts`. 

Command functions can be and are re-used by other commands to avoid redundancy. The only caveat is that they should be called through the `function` property as illustrated below.
```javascript
import imdbHalper from '../imdb/findMovieTitle.halp';
const imdbResults = await imdbHalper.action(query);
```

There is also a limited set of helper functions available, most prominently a set of HTTP request wrappers for [axios](https://www.npmjs.com/package/axios), the HTTP library used by Halpers. These can be found under `src/calls.ts`. 

It is also recommended to add various default values shared among commands (e.g. `firstName`) to the general config to retain as much consistency as possible. These can be imported from `src/helpers/conf`. The values themselves are the concatenated result of `configs/base.conf.json` and `configs/<designated-environment>.conf.json`. 

## Example action
Create `src/actions/sayHi.halp.ts` with the contents below and build with `npm run build`. That's it, you're done! Your local Halpers installation now support `say-hi`. Try it out with `halp say-hi`.
```javascript
async function sayHi(firstName, lastName) {
  return `Hello, ${firstName} ${lastName}!`;
}

export default {
  command: 'say-hi',                              // Run the command with `halp say-hi`.
  function: sayHi,                                // Designates the function above as the one to call.
  spinnerText: 'Preparing to say hi!',            // The text shown while the action is being processed.
  args: [                                         // A list of arguments that maps to `firstName` and `lastName` above.
    {
      flag: 1,                                    // The first unflagged command line argument will be passed to `firstName`.
      requiredMessage: 'First name is required',  // If there are no unflagged arguments, this error will be thrown.
    },
    {
      flag: 'l',                                  // If there is a command line argument flagged with `-l` it will be passed as `lastName`.
      default: 'the Unknown',                     // If no -l option is passed, `lastName` will default to "the Unknown".
    },
  ],
};
```

Calling `say-hi` without any unflagged arguments will result in an error, as the first item with flag `1` in `args` has a `requiredMessage`.
```bash
halp say-hi                     // First name is required
halp Johnny                     // Hello, Johnny
```
The second item in `args` is linked to the `-l` flag, but can safely be omitted as it has no `requiredMessage`.
```bash
halp say-hi Johnny -l Bravo     // Hello, Johnny Bravo
halp say-hi Johnny              // Hello, Johnny
halp say-hi -l Bravo            // First name is required
```