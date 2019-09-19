# Doppler Radar

Radar is a token scanning tool that detects API keys, credentials, database urls, and other sensitive secrets in your code. It curbs fraudulent use and unauthorized access of secrets that have been accidentally committed. Radar can integrate with your CI/CD pipeline to continuously monitor and halt leaks before they are merged upstream. Do you know how many secrets have already slipped into your repos? Radar can help you track them down.

**Note:** Radar does not make any network requests and all secrets analysis will be performed locally. This might seem obvious, but we want it to be especially explicit.

## Installation

```
$ npm install -g @dopplerhq/radar
```

## Usage

### Command Line

Scan a local file/directory:
```
$ radar scan PATH
```

Scan a git repo:
```
$ radar scan REPO_URL [--branch BRANCH]
```

You can see a full list of configuration options by running `radar --help`
```
$ radar scan --help

Usage: scan [options] <path>

Scan a file, directory, or remote git repo for secrets

Options:
  -b, --branch <name>         Scan the git branch (specified path must be a git url)
  --secret-types <list>       Secret types to scan for (from `radar list secrets`)
  --max-file-size <MiB>       Don't scan any files larger than this
  --include-files <list>      File names to scan; overrides excluded files. Supports globs. Case-insensitive. Example: `--include-files "yarn.lock"`. See excluded files with `radar list defaults excludedFiles`
  --exclude-files <list>      File names to exclude. Supports globs. Case-insensitive. Example: `--exclude-files "test.*"` to exclude all files named 'test' with any extension
  --include-dirs <list>       Directory names to scan; overrides excluded directories. Supports globs. Case-insensitive. Example: `--include-dirs "node_modules"` to include 'node_modules' within the root directory. See excluded directories with `radar list defaults excludedDirectories`
  --exclude-dirs <list>       Directory names to exclude. Supports globs. Case-insensitive. Example: `--exclude-dirs "**/node_modules/"` will exclude the 'node_modules' directory located in the root and any subdirectories. `--exclude-dirs "node_modules/"` will only exclude the 'node_modules' directory located in the root.
  --include-file-exts <list>  File extensions to scan; overrides excluded file extensions. Supports globs. Case-insensitive. Example: `--include-file-exts "*.txt,*.ini"`. See excluded file extensions with `radar list defaults excludedFileExts`
  --exclude-file-exts <list>  File extensions to exclude. Supports globs. Case-insensitive. Example: `--exclude-file-exts "*.js,*example*"` to exclude any file with an extension ending with '.js' (e.g. file.js, file.test.js) or containing 'example' (e.g. 'file.example', 'file.example.c', 'file.c.example')
  --json                      Output results as json blob
  --no-progress               Disable the progress bar
  -h, --help                  output usage information
```

See all available commands
```
Usage: radar [options] [command]

Detect API keys, credentials, and other sensitive secrets in your codebase

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  scan <path>    Scan a file, directory, or remote git repo for secrets
  list <type>    List available configuration
  help [cmd]     display help for [cmd]
```

### Node library

Scan a local file/directory:

``` js
const Radar = require("@dopplerhq/radar");
const results = new Radar().scan(directory_path);
```

#### Configuration

You can further configure the Node library by passing in a configuration object.

``` js
const Radar = require("@dopplerhq/radar");
const config = {
  secretTypes: ["auth_urls", "crypto_keys", "api_keys"],
};
const results = new Radar(config).scan(directory_path);
```

## Sample output

This is the sample output of running the CLI on a repo with a `.env` file containing two API keys. Scan results are printed in a tabular format.

```
File  Line  Secret                                            Type
----  ----  ------------------------------------------------  -------
.env  4     BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG          api_key
      11    SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA  api_key
```

You can instruct the CLI to output JSON by specifying the `--json` flag. This output is functionally identical to the results returned by the Node library's `scan()` function.

```json
{
  ".env": {
    "metadata": {
      "fileSize": 903,
      "fileExtension": "env"
    },
    "lines": [
      {
        "line": "STRIPE_API_KEY=BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG",
        "lineNumber": 4,
        "findings": [
          {
            "text": "BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG",
            "type": "api_key"
          }
        ]
      },
      {
        "line": "SENDGRID_API_KEY=SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA",
        "lineNumber": 11,
        "findings": [
          {
            "text": "SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA",
            "type": "api_key"
          }
        ]
      }
    ]
  }
}
```

## Why it matters
API token leakage is rampant. In a high profile study, North Carolina State University identified over 200,000 secrets across 100,000 public GitHub repositories. These secrets were sitting on the public internet and available to any adversary. With these secrets, anyone could have accessed confidential/legally protected data or racked up a huge bill. Static secrets also tend to indicate the use of that same secret across all environments, breaking another security best practice. Security is hard™, but a few small steps can go a long way towards increasing your organization's security posture.

## Architecture

Radar is entirely language agnostic and was built to be extensible. Thus, its model is a bit different than other tools. Most tools use a set of regex patterns to identify tokens from common service providers (Radar's `known_api_keys` secret type provides this functionality). This is highly reliable for supported services, but has the obvious shortcomings of a) supporting a limited number of services and b) not supporting other types of static secrets. Radar is able to remain language agnostic while detecting more secrets than other tools by employing three different constructs: Secret Types, Filters, and Classifiers.

**Secret Types**: Radar defines the secrets it should try to identify by declaring Secret Types. Each Secret Type specifies the filters it uses to qualify (and disqualify) arbitrary text. The results from multiple filters are combined to more accurately determine is some text is a secet.

**Filters**: Filters are small pieces of code that answer a simple question: is this text a url, is this a date, is this an email address, etc. Filters are intended to be narrow in scope.

**Classifiers**: Classifiers make our scanning efforts more granular by specifying file types that should/shouldn't be scanned. For example, we can restrict cryptographic private key scanning to files using a known key extension (e.g. .pem and .key). This allows us to increase Radar's speed while reducing false positives.

Together, these three contructs allow Radar to work. Check out the examples folder to see a sample Secret Type, Filter, and Classifier. The Secret Type is responsible for orchestrating the filter and classifier. You can also check out the project's existing secret types/filters/classifiers and their respective base classes for more info.

## False positives

Radar has the explicit goal of minimizing false positives to avoid generating useless noise. We tend to find that when a security tool is overly noisy, humans begin to ignore all of its output. The way we accomplish false positive minimization is with carefully chosen tradeoffs. For example, Radar ignores all identified UUIDs. Some services do provide a UUID (hopefully v4) as a secret, however most static UUIDs we see in code are not in fact secrets. Thus, we trade a few potential true positives for a large reducion in false positives.

## Thoughts?
You wouldn't ride in a leaky boat; why would you ship a leaky app?
