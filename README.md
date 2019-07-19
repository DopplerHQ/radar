# Doppler Radar

Radar is a token scanning tool that detects API keys, credentials, database urls, and other sensitive secrets in your codebase. It curbs fraudulent use and unauthorized access of your secrets that were accidentally committed. For security to be built into every application, Radar can integrate with your CI/CD pipeline to continuously monitor and halt leaks before they are merged upstream. And do you know how many secrets have already slipped into your repos? Radar can help you track them down.

Note: Radar does not perform any network requests and the secrets analysis will be performed entirely locally. This might seem obvious to you, but we want it to be especially explicit.

## Installation

```
$ npm install -g @dopplerhq/radar
```

## Usage

### Command Line

Scan a git repo:
```
$ radar --repo REPO_URL [--branch BRANCH]
```

Scan a local file/directory:
```
$ radar --path PATH
```

You can see a full list of configuration options by running `radar --help`
```
$ radar --help

Usage: radar [options]

Options:
  -V, --version               output the version number
  -p, --path <path>           Scan the specified path
  -r, --repo <url>            Scan the specified git repo url
  -b, --branch <name>         Scan the specified git branch
  --secret-types <list>       Secret types to scan for (e.g. "crypto_keys, auth_urls")
  --max-file-size <MiB>       Maximum size of files to scan
  --include-files <list>      File names to include, case-insensitive (overrides excluded files)
  --exclude-files <list>      File names to exclude, case-insensitive (e.g. "package.json, CHANGELOG.md")
  --include-dirs <list>       Directory names to include, case-insensitive (overrides excluded directories)
  --exclude-dirs <list>       Directory names to exclude, case-insensitive (e.g. "test, e2e")
  --include-file-exts <list>  File extensions to include, case-insensitive (overrides excluded file extensions)
  --exclude-file-exts <list>  File extensions to exclude, case-insensitive (e.g. "md, tar.gz, csv")
  --json                      Output results as json blob
  --no-progress               Disable the progress bar
  -h, --help                  output usage information
```

### Node library

Scan a local file/directory:

``` js
const { Radar } = require("@dopplerhq/radar");
const results = new Radar().scan(directory_path);
```

#### Configuration

You can further configure the Node library by passing it a `Config` object.

``` js
const { Radar, Config } = require("@dopplerhq/radar");
const config = new Config();
config.setSecretTypes(["auth_urls", "crypto_keys", "api_keys"]);
const results = new Radar(config).scan(directory_path);
```

## Sample output

This is the sample output of running the CLI on a repo with a `.env` file containing two API keys. Scan results are printed in a tabular format.

```
File  Line  Secret                                            Type
----  ----  ------------------------------------------------  -------
.env  4     BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG          API Key
      11    SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA  API Key
```

You can instruct the CLI to output JSON by specifying the `--json` flag. This output is identical to the results returned by the Node library's `scan()` function.

```json
{
  ".env": {
    "metadata": {
      "fileSize": 903,
      "fileExtension": "env"
    },
    "secrets": [
      {
        "secret": "BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG",
        "type": "API Key",
        "line": "STRIPE_API_KEY=BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG",
        "lineNumber": 4
      },
      {
        "secret": "SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA",
        "type": "API Key",
        "line": "SENDGRID_API_KEY=SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA",
        "lineNumber": 11
      }
    ]
  }
}
```

## Why it matters
API token leakage is rampant. In a high profile study, North Carolina State University identified over 200,000 secrets across 100,000 public GitHub repositories. These secrets were sitting on the public internet and available to any adversary. With these secrets, anyone could have accessed confidential/legally protected data or racked up a huge bill. Static secrets also tend to indicate the use of that same secret across all environments, breaking another security best practice. Security is hard™, but a few small steps can go a long way towards increasing your organization's security posture.

## How it works

Radar uses filters to calculate the likelihood that a string is a stored secret. This includes things like the string's entropy, the inclusion of dictionary words, and more. A list of identified secrets is returned so that action may be taken.

Radar's model is a bit different than other tools. These tools typically employ a set of regex patterns to identify tokens from common service providers. This is highly reliable for supported services, but has the obvious shortcomings of a) supporting a limited number of services and b) not supporting other types of static secrets. The filter approach that Radar employs casts a wider net, which can result in false positives. Radar has the explicit goal of minimizing these false positives to avoid generating useless noise. We tend to find that when a security tool is overly noisy, humans begin to ignore all of its output.

## Thoughts?
You wouldn't ride in a leaky boat; why would you ship a leaky app?
