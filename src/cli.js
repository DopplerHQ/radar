#!/usr/bin/env node

const program = require('commander');

const packageFile = require('../package');
const Config = require('./config');
const Radar = require('./radar');
const Git = require('./git');
const Filesystem = require('./filesystem');

/**
TODO:

User configurable:
- exclude files/directories
- include files/directories
 */

class CLI {
  constructor() {
    this.config = new Config();
  }

  async run() {
    program
      .name("radar")
      .version(packageFile.version)
      .option("-p, --path <path>", "Scan the specified path")
      .option("-r, --repo <url>", "Scan the specified git repo url")
      .option("-b, --branch <name>", "Scan the specified git branch")
      .option("--max-file-size <MiB>", "Maximum size of files to scan")
      .option("--min-match-score <number>", "Minimum score for a token to be considered a match, between 0 and 1. Defaults to .7")
      .option("--include-file-exts <list>", "File extensions to include")
      .option("--exclude-file-exts <list>", "File extensions to exclude (e.g. \"json, map, csv\")")
      .parse(process.argv);

    this.setConfig(program);

    let { path } = program;
    const { repo, branch } = program;

    if (repo) {
      path = await CLI.cloneRepo(repo, branch);
    }

    if (!path) {
      return Promise.reject("You must specify a path or repo");
    }

    return this.scan(path);
  }

  async scan(path) {
    const radar = new Radar(this.config);
    return radar.scan(path);
  }

  static async cloneRepo(repo, branch) {
    const tempPath = await Filesystem.makeTempDirectory();
    await Git.clone(repo, tempPath, branch);
    return tempPath;
  }

  setConfig(program) {
    const { maxFileSize, minMatchScore, includeFileExts, excludeFileExts } = program;

    if (maxFileSize) {
      this.config.setMaxFileSizeMiB(maxFileSize);
    }

    if (minMatchScore) {
      this.config.setMinMatchScore(minMatchScore);
    }

    if (includeFileExts) {
      this.config.setIncludedFileExts(includeFileExts.split(",").map(ext => ext.trim()));
    }

    if (excludeFileExts) {
      this.config.setExcludedFileExts(excludeFileExts.split(",").map(ext => ext.trim()));
    }
  }
}

return new CLI().run()
    .then(result => console.dir(result, { depth: 3 } ))
    .catch((err) => console.error(err));
