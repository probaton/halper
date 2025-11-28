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

# System Commands
Halpers comes with several built-in commands fundamental to its life-cycle.

## `halp build`
Convenience method that mimics `npm run build`, recompiling the project without having to navigate to the project directory. (Re)compilation is required to make new changes available whenever commands are added or updated.

Note that running this command while the project contains TypeScript errors will break Halpers and consequently also break this command. To bring Halpers back online, simply fix your TypeScript errors, navigate to the Halpers project, and run `npm run build`. 

## `halp link-module <full-path-to-module-directory>`
Links commands from an external directory so that they can be used by Halpers. Useful if a set of commands is not suitable for general use, but does belong together or require a git repository. Note that the input parameter should be the _full_ (!relative) path to the module, and should point at a folder, not a specific Halper file. 

As always when a new command is added, Halpers should be recompiled using `halp build` to make them available.

Linked commands are git-ignored by default, which generally obfuscates them in most IDEs. This can easily be circumvented by telling your IDE to open them manually. For example, VS Code will filter out linked commands if targeted through the "Open file" key bind, but will open them just fine when running `code src/actions/modules/<module-name>/<command-name>.halp.ts` from the Halper root directory.  

## `halp unlink-module <module-name>`
Unlinks an external module linked using `halp link-module` by deleting the symlink. The project will have to be recompiled using `halp build` to remove them from use.  

# Options
In addition to any custom flags supported by individual commands, Halpers provides a number of universal convenience flags that can be applied to any command. Custom halpers should avoid implementing these flags, as inevitable conflicts will occur. 

## `-h`/`--help`
Prints a list of available actions or (more) detailed information on a command, depending on whether a command is included. Command information is derived from the `helpText` values associated with that command, as explained in [next section](#contributing).

## `-e`
The target environment can be set with the `-e` flag. Valid options are `dev` and `local`. The default is `dev`. E.g. `halp -e local words "cookies"`. This can be useful if a command can be run in different contexts that require a different set of configuration parameters. Configs can be added and edited under `configs/`.

## `-w`/`--write`
Running a command with `-w` will write the command output to a file instead of printing it in the console. The flag can either be empty (i.e. `true`), in which case the output will be saved to `exports/<command>.txt`, or you can specify a file name. For example, `-w output.csv` saves the output to `exports/output.csv`.  

## `--stringify`
Passing `--stringify` will attempt to convert the output of the `halp` command to plain text. Use this to expand `Object` or `Array` items that are automatically truncated by NodeJS. 

## `--traverse`
If the output of the chosen command is a valid JSON object, the string passed to this flag will be applied to the object as if it were invoked in code. The flag accepts both indices and direct property invocations, as well as chaining. 

### Example
```
// Command output without traversal
halp example-command
{
  arrayProp: [{ subObjectProp: 'Hello!' }]
}

// Command output with traversal
halp example-command --traverse "arrayProp[0].subObjectProp"
Hello!
```

## `--log-call`
Logs the method, URL, and body of any requests made using the `calls` utility.

## `--log-arg`
Logs all command line arguments and how they were mapped by Halpers. Useful for debugging scenarios where Halpers seems to be assigning incorrect values to input parameters.

## `--invalidate-cache`
Halpers has a simple built-in caching system that saves values to a file in the `hardCache` folder. Passing `--invalidate-cache` tells Halpers to ignore values cached in this manner.

# `halpMan`, the Global Halpers Manager
To assist in debugging and give the user more fine-grained control, Halpers exposes several useful utilitiese through a global `halpMan` variable.

## `halpMan.log()`
Halpers' loading spinner, implemented using [ora](https://www.npmjs.com/package/ora), tends to mangle the output of `console.log()`. `halpMan.log()` implements a wrapper to circumvent this issue. Otherwise works exactly the same as `console.log()`. 

## `halpMan.spinner`
The [ora](https://www.npmjs.com/package/ora) spinner instance running throughout the command. 

## `halpMan.pargs`
Shorthand for "parsed arguments", `halpMan.pargs` gives the use access to all arguments passed into and parsed by Halpers. Arguments assigned to a flag (e.g. `-w <file-name>`/`--write <file-name>`) are assigned to `pargs.labeled[<flag>]`. Arguments without a flag are assigned to `pargs.indexed`.

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

Command functions can be and are re-used by other commands to avoid redundancy. The only caveat is that they should be called through the `action` property as illustrated below.
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