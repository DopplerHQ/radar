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
    this.options = {};
  }

  setOptions(options) {
    this.options = options;
  }

  async scan(path) {
    const { branch, json } = this.options;

    const isGitUrl = (path.endsWith(".git") && (path.startsWith("https://") || path.startsWith("git@")));
    if (isGitUrl) {
      if (!json) {
        console.log(`Checking out ${branch ? `branch ${branch} in repo` : "repo"} ${path}`);
    }
      path = await CLI.cloneRepo(path, branch);
    }

    const config = this.generateRadarConfig();
    const radar = new Radar(config, this.onFilesToScan.bind(this), this.onFileScanned.bind(this));
    return radar.scan(path);
  }

  list(listType) {
    const { json } = this.options;
    const types = ["secret-types", "filters", "defaults"];

    if (!types.includes(listType)) {
      console.log(`Invalid list type. Valid types are: ${types.join(", ")}`);
      return;
    }

    switch (listType) {
      case "secret-types":
        const secretTypes = (new Radar()).listSecretTypes();
        if (json) {
          console.log(secretTypes);
        }
        else {
          const table = new Table();
          secretTypes.forEach((type) => {
            table.cell('Secret Type', type);
            table.newRow();
          })
          console.log(table.toString());
        }
        break;
      case "filters":
        const filters = (new Radar()).listFilters();
        if (json) {
          console.log(filters);
        }
        else {
          const table = new Table();
          filters.forEach((filter) => {
            table.cell('Filter', filter);
            table.newRow();
          })
          console.log(table.toString());
        }
        break;
      case "defaults":
        const config = (new Radar()).config();
        if (json) {
          console.log(config);
        }
        else {
          const table = new Table();
          Object.keys(config).forEach((key) => {
            table.cell('Key', key);
            table.cell('Value', config[key]);
            table.newRow();
          })
          console.log(table.toString());
        }
        break;
    }
  }

  printScanResults(results) {
    if (this.options.json) {
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
    const { secretTypes, maxFileSize, includeFiles, excludeFiles, includeDirs, excludeDirs, includeFileExts, excludeFileExts } = this.options;

    const parseStringArray = str => str.split(",").map(s => s.trim());

    return {
      secretTypes: secretTypes ? parseStringArray(secretTypes) : undefined,
      maxFileSizeMiB: maxFileSize,
      includedFiles: includeFiles ? parseStringArray(includeFiles) : undefined,
      excludedFiles: excludeFiles ? parseStringArray(excludeFiles) : undefined,
      includedDirectories: includeDirs ? parseStringArray(includeDirs) : undefined,
      excludedDirectories: excludeDirs ? parseStringArray(excludeDirs) : undefined,
      includedFileExts: includeFileExts ? parseStringArray(includeFileExts) : undefined,
      excludedFileExts: excludeFileExts ? parseStringArray(excludeFileExts) : undefined,
    };
  }

  onFilesToScan(num) {
    if (this.options.progress) {
      this.progressBar.init(num);
    }
  }

  onFileScanned() {
    if (this.options.progress) {
      this.progressBar.increment();
    }
  }
}

const loadCommands = () => {
  program
    .name("radar")
    .version(packageFile.version)
    .action(() => {
      console.log(`Invalid command`);
      program.help();
    })

  program
    .command("scan <path>")
    .description("Scan a file, directory, or remote git repo for secrets")
    .option("-b, --branch <name>", "Scan the git branch (specified path must be a git url)")
    .option("--secret-types <list>", "Secret types to scan for (e.g. \"crypto_keys, auth_urls\")")
    .option("--max-file-size <MiB>", "Maximum size of files to scan")
    .option("--include-files <list>", "File names to include, case-insensitive (overrides excluded files)")
    .option("--exclude-files <list>", "File names to exclude, case-insensitive (e.g. \"package.json, CHANGELOG.md, src/test.js\")")
    .option("--include-dirs <list>", "Directory names to include, case-insensitive (overrides excluded directories)")
    .option("--exclude-dirs <list>", "Directory names to exclude, case-insensitive (e.g. \"test, e2e\")")
    .option("--include-file-exts <list>", "File extensions to include, case-insensitive (overrides excluded file extensions)")
    .option("--exclude-file-exts <list>", "File extensions to exclude, case-insensitive (e.g. \"md, tar.gz, csv\")")
    .option("--json", "Output results as json blob")
    .option("--no-progress", "Disable the progress bar")
    .action((path, options) => {
      cli.setOptions(options);
      cli.scan(path)
        .then(results => cli.printScanResults(results))
    .catch(console.error);
    });

  program
    .command("list <type>")
    .description("Print radar configuration")
    .option("--json", "Output results as json blob")
    .action((listType, options) => {
      cli.setOptions(options);
      cli.list(listType);
    });
}

const cli = new CLI();
loadCommands();
program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
