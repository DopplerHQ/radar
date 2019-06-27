# Doppler Radar

Radar is a token scanning tool that detects API keys, credentials, database urls, and other sensitive secrets in your codebase. It curbs fraudulent use and unauthorized access of your secrets that were accidentally committed. For security to be built into every application, Radar can integrate with your CI/CD pipeline to continuously monitor and halt leaks before they are merged upstream. And do you know how many secrets have already slipped into your repos? Radar can help you track them down.

Note: Radar does not perform any network requests and the secrets analysis will be performed entirely locally. This might seem obvious to you, but we want it to be especially explicit.

## Installation

```
npm install -g @dopplerhq/radar
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

You can see a full list of configuration options by running 
```
$ radar --help

Usage: radar [options]

Options:
  -V, --version               output the version number
  -p, --path <path>           Scan the specified path
  -r, --repo <url>            Scan the specified git repo url
  -b, --branch <name>         Scan the specified git branch
  --max-file-size <MiB>       Maximum size of files to scan
  --min-match-score <number>  Minimum score for a token to be considered a match, between 0 and 1. Defaults to .7
  --include-file-exts <list>  File extensions to include
  --exclude-file-exts <list>  File extensions to exclude (e.g. "json, map, csv")
  -h, --help                  output usage information
```

### Library

Scan a local file/directory:

``` js
const radar = require("@dopplerhq/radar");
const results = new radar().scan(directory_path);
```

## Sample output

This is the sample output of running the CLI on a repo with a `.env` file containing two API keys. If using the library directly, this same output will be returned as a JavaScript object by `scan()`.

```json
{
  ".env": {
    "metadata": {
      "fileSize": 903,
      "fileExtension": "env"
    },
    "keys": [
      {
        "key": "BpvW9qw31eXXHEGDMbERBkQ24lF6EWkUyaOgU4LG",
        "lineNumber": 4,
        "score": 0.9
      },
      {
        "key": "SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA",
        "lineNumber": 11,
        "score": 0.95
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
