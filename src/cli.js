#!/usr/bin/env node

const program = require('commander');
const Table = require('easy-table');

const packageFile = require('../package');
const { Radar, Config } = require('./radar');
const Git = require('./git');
const Filesystem = require('./filesystem');
const ProgressBar = require('./progressbar');

class CLI {
  constructor() {
    this.config = new Config();
    this.progressBar = new ProgressBar();

    program
      .name("radar")
      .version(packageFile.version)
      .option("-p, --path <path>", "Scan the specified path")
      .option("-r, --repo <url>", "Scan the specified git repo url")
      .option("-b, --branch <name>", "Scan the specified git branch")
      .option("--secret-types <list>", "Secret types to scan for (e.g. \"crypto_keys, auth_urls\")")
      .option("--max-file-size <MiB>", "Maximum size of files to scan")
      .option("--include-files <list>", "File names to include, case-insensitive (overrides excluded files)")
      .option("--exclude-files <list>", "File names to exclude, case-insensitive (e.g. \"package.json, CHANGELOG.md\")")
      .option("--include-dirs <list>", "Directory names to include, case-insensitive (overrides excluded directories)")
      .option("--exclude-dirs <list>", "Directory names to exclude, case-insensitive (e.g. \"test, e2e\")")
      .option("--include-file-exts <list>", "File extensions to include, case-insensitive (overrides excluded file extensions)")
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
      if (Object.keys(results).length === 0) {
        console.log("No secrets detected");
        return;
      }

      const resultsArr = [];
      Object.keys(results).forEach((file) => {
        results[file].keys.forEach((secret, i) => resultsArr.push({
          File: (i === 0) ? file : "",
          Line: secret.lineNumber,
          Secret: secret.secret,
          Type: secret.type,
        }))
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
    const { secretTypes, maxFileSize, includeFiles, excludeFiles, includeDirs, excludeDirs, includeFileExts, excludeFileExts } = program;

    if (secretTypes) {
      this.config.setSecretTypes(secretTypes);
    }

    if (maxFileSize) {
      this.config.setMaxFileSizeMiB(maxFileSize);
    }

    if (includeFiles) {
      this.config.setIncludedFiles(includeFiles.split(",").map(name => name.trim().toLowerCase()));
    }

    if (excludeFiles) {
      this.config.setExcludedFiles(excludeFiles.split(",").map(name => name.trim().toLowerCase()));
    }

    if (includeDirs) {
      this.config.setIncludedDirectories(includeDirs.split(",").map(name => name.trim().toLowerCase()));
    }

    if (excludeDirs) {
      this.config.setExcludedDirectories(excludeDirs.split(",").map(name => name.trim().toLowerCase()));
    }

    if (includeFileExts) {
      this.config.setIncludedFileExts(includeFileExts.split(",").map(ext => ext.trim().toLowerCase()));
    }

    if (excludeFileExts) {
      this.config.setExcludedFileExts(excludeFileExts.split(",").map(ext => ext.trim().toLowerCase()));
    }
  }

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
}

const cli = new CLI();
return cli.run(process.argv)
    .then(cli.print)
    .catch(console.error);
