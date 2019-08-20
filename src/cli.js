#!/usr/bin/env node

const program = require('commander');
const ProgressBar = require('./progressbar');

const Radar = require('./radar');
const Filesystem = require('./filesystem');
const Git = require('./git');
const packageFile = require('../package');
const Printer = require('./Printer');

class CLI {
  constructor() {
    this.progressBar = new ProgressBar();

    this.loadCommands();
  }

  loadCommands() {
    program
      .name("radar")
      .version(packageFile.version)
      .action(() => {
        console.log(`Invalid command`);
        program.help();
      });

    program
      .command("test")
      .description("test description");

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
      .action(async (path, options) => {
        const { json, progress } = options;

        const isGitUrl = (path.endsWith(".git") && (path.startsWith("https://") || path.startsWith("git@")));
        if (isGitUrl) {
          if (!json) {
            console.log(`Checking out ${branch ? `branch ${branch} in repo` : "repo"} ${path}`);
          }
          path = await Git.clone(path, branch);
        }
        else {
          if (!(await Filesystem.pathExists(path))) {
            console.error(`Path does not exist: ${path}`);
            return;
          }
        }

        try {
          const onFilesToScan = progress ? this.onFilesToScan.bind(this) : () => {};
          const onFileScanned = progress ? this.onFileScanned.bind(this) : () => {};
          const radar = new Radar(CLI.generateRadarConfig(options), onFilesToScan, onFileScanned);
          Printer.printScanResults(await radar.scan(path), json)
        }
        catch(err) {
          console.error(err);
        }
      });

    program
      .command("list-secrets")
      .description("Print all available secret types")
      .option("--json", "Output results as json blob")
      .action((options) => {
        Printer.printSecretTypes((new Radar()).listSecretTypes(), options.json);
      });

    program
      .command("list-filters")
      .description("Print all available filters")
      .option("--json", "Output results as json blob")
      .action((options) => {
        Printer.printFilters((new Radar()).listFilters(), options.json);
      });

    program
      .command("list-defaults")
      .description("Print the default configuration")
      .option("--json", "Output results as json blob")
      .action((options) => {
        Printer.printDefaults((new Radar()).config(), options.json);
      });
  }

  run(args = []) {
    program.parse(args);

    if (program.args.length === 0) {
      program.help();
    }
  }

  onFilesToScan(num) {
    this.progressBar.init(num);
  }

  onFileScanned() {
    this.progressBar.increment();
  }

  static generateRadarConfig(options) {
    const { secretTypes, maxFileSize, includeFiles, excludeFiles, includeDirs, excludeDirs, includeFileExts, excludeFileExts } = options;

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
}

const cli = new CLI();
cli.run(process.argv);
