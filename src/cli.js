#!/usr/bin/env node

const program = require('commander');
const Table = require('easy-table');

const packageFile = require('../package');
const Radar = require('./radar');
const Git = require('./git');
const Filesystem = require('./filesystem');
const ProgressBar = require('./progressbar');

class CLI {
  constructor() {
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
      .option("--exclude-files <list>", "File names to exclude, case-insensitive (e.g. \"package.json, CHANGELOG.md, src/test.js\")")
      .option("--include-dirs <list>", "Directory names to include, case-insensitive (overrides excluded directories)")
      .option("--exclude-dirs <list>", "Directory names to exclude, case-insensitive (e.g. \"test, e2e\")")
      .option("--include-file-exts <list>", "File extensions to include, case-insensitive (overrides excluded file extensions)")
      .option("--exclude-file-exts <list>", "File extensions to exclude, case-insensitive (e.g. \"md, tar.gz, csv\")")
      .option("--json", "Output results as json blob")
      .option("--no-progress", "Disable the progress bar");
  }

  async run(args) {
    program.parse(args);

    let { path } = program;
    const { repo, branch } = program;

    if (repo) {
      path = await CLI.cloneRepo(repo, branch);
    }

    if (!path) {
      program.help();
      return Promise.reject();
    }

    const config = this.generateRadarConfig();
    const radar = new Radar(config, this.onFilesToScan.bind(this), this.onFileScanned.bind(this));
    return radar.scan(path);
  }

  print(results) {
    if (program.json) {
      console.dir(results, { depth: 5 } );
      return;
    }

    if (Object.keys(results).length === 0) {
      console.log("No secrets detected");
      return;
    }

    const resultsArr = [];
    Object.keys(results).forEach((file) => {
      results[file].lines.forEach((line, lineNumber) => {
        line.findings.forEach((finding, findingNumber) => resultsArr.push({
          File: (lineNumber === 0 && findingNumber === 0) ? file : "",
          Line: line.lineNumber,
          Secret: finding.text,
          Type: finding.type,
        }))
      })
    });

    console.log(Table.print(resultsArr));
  }

  static async cloneRepo(repo, branch) {
    const tempPath = await Filesystem.makeTempDirectory();
    await Git.clone(repo, tempPath, branch);
    return tempPath;
  }

  generateRadarConfig() {
    const { secretTypes, maxFileSize, includeFiles, excludeFiles, includeDirs, excludeDirs, includeFileExts, excludeFileExts } = program;

    return {
      secretTypes,
      maxFileSizeMiB: maxFileSize,
      includedFiles: includeFiles ? includeFiles.split(",").map(name => name.trim()) : undefined,
      excludedFiles: excludeFiles ? excludeFiles.split(",").map(name => name.trim()) : undefined,
      includedDirectories: includeDirs ? includeDirs.split(",").map(name => name.trim()) : undefined,
      excludedDirectories: excludeDirs ? excludeDirs.split(",").map(name => name.trim()) : undefined,
      includedFileExts: includeFileExts ? includeFileExts.split(",").map(ext => ext.trim()) : undefined,
      excludedFileExts: excludeFileExts ? excludeFileExts.split(",").map(ext => ext.trim()) : undefined,
    };
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
