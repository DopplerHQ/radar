#!/usr/bin/env node

const program = require('commander');
const Table = require('easy-table');

const packageFile = require('../package');
const { Radar, Config } = require('./radar');
const Git = require('./git');
const Filesystem = require('./filesystem');
const ProgressBar = require('./progressbar');

/**
TODO:

User configurable:
- exclude files/directories
- include files/directories
 */

class CLI {
  onFilesToScan(num) {
    if (program.progress) {
      this.progressBar.init(num);
    }
  }

  onFileScanned() {
    if (program.progress) {
      this.progressBar.increment();
    }
  }

  constructor() {
    this.config = new Config();
    this.progressBar = new ProgressBar();

    program
      .name("radar")
      .version(packageFile.version)
      .option("-p, --path <path>", "Scan the specified path")
      .option("-r, --repo <url>", "Scan the specified git repo url")
      .option("-b, --branch <name>", "Scan the specified git branch")
      .option("--max-file-size <MiB>", "Maximum size of files to scan")
      .option("--min-match-score <number>", "Minimum score for a token to be considered a match, between 0 and 1. Defaults to .7")
      .option("--include-file-exts <list>", "File extensions to include, case-insensitive (overrides exclusion)")
      .option("--exclude-file-exts <list>", "File extensions to exclude, case-insensitive (e.g. \"md, tar.gz, csv\")")
      .option("--json", "Output results as json blob")
      .option("--no-progress", "Disable the progress bar");
  }

  async run(args) {
    program.parse(args);
    this.setConfig();

    let { path } = program;
    const { repo, branch } = program;

    if (repo) {
      path = await CLI.cloneRepo(repo, branch);
    }

    if (!path) {
      program.help();
      return Promise.reject();
    }

    const radar = new Radar(this.config, this.onFilesToScan.bind(this), this.onFileScanned.bind(this));
    return radar.scan(path);
  }

  print(results) {
    if (program.json) {
      console.dir(results, { depth: 3 } );
    }
    else {
      const resultsArr = [];
      const maxKeyLength = 75;
      Object.keys(results).forEach((file) => {
        results[file].keys.forEach((key, i) => {
          const object = {
            File: (i === 0) ? file : "",
            Line: key.lineNumber,
            Key: (key.key.length > maxKeyLength) ? `${key.key.substring(0, maxKeyLength)}...` : key.key,
            Score: key.score.toPrecision(2),
          }

          resultsArr.push(object);
        });
      });

      console.log(Table.print(resultsArr));
    }
  }

  static async cloneRepo(repo, branch) {
    const tempPath = await Filesystem.makeTempDirectory();
    await Git.clone(repo, tempPath, branch);
    return tempPath;
  }

  setConfig() {
    const { maxFileSize, minMatchScore, includeFileExts, excludeFileExts } = program;

    if (maxFileSize) {
      this.config.setMaxFileSizeMiB(maxFileSize);
    }

    if (minMatchScore) {
      this.config.setMinMatchScore(minMatchScore);
    }

    if (includeFileExts) {
      this.config.setIncludedFileExts(includeFileExts.split(",").map(ext => ext.trim().toLowerCase()));
    }

    if (excludeFileExts) {
      this.config.setExcludedFileExts(excludeFileExts.split(",").map(ext => ext.trim().toLowerCase()));
    }
  }
}

const cli = new CLI();
return cli.run(process.argv)
    .then(cli.print)
    .catch(console.error);
