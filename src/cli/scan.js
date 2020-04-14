const program = require('commander');
const Table = require('easy-table');

const Radar = require('../radar');
const Filesystem = require('../filesystem');
const Git = require('../git');
const ProgressBar = require('../progressbar');
const util = require('./util');

const generateRadarConfig = (options)  =>{
  const {
    secretTypes,
    maxFileSize,
    maxConcurrentFileReads,
    maxFindingsPerFile,
    includeFiles,
    excludeFiles,
    includeDirs,
    excludeDirs,
    includeFileExts,
    excludeFileExts,
    customPatterns,
  } = options;

  return {
    secretTypes: util.parseStringArray(secretTypes),
    maxFileSizeMiB: util.parseNumber(maxFileSize),
    maxConcurrentFileReads: util.parseNumber(maxConcurrentFileReads),
    maxFindingsPerFile: util.parseNumber(maxFindingsPerFile),
    includedFiles: util.parseStringArray(includeFiles),
    excludedFiles: util.parseStringArray(excludeFiles),
    includedDirectories: util.parseStringArray(includeDirs),
    excludedDirectories: util.parseStringArray(excludeDirs),
    includedFileExts: util.parseExtensionArray(includeFileExts),
    excludedFileExts: util.parseExtensionArray(excludeFileExts),
    customPatterns: util.parseStringArray(customPatterns),
  };
};

const printScanResults = (results, json = false) => {
  if (json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (Object.keys(results).length === 0) {
    console.log("No secrets detected");
    return;
  }

  // print results table
  const resultsArr = [];
  Object.keys(results).forEach((file) => {
    results[file].lines.filter(line => (line.findings.length > 0))
      .forEach((line, lineNumber) => {
        line.findings.forEach((finding, findingNumber) => resultsArr.push({
          File: (lineNumber === 0 && findingNumber === 0) ? file : "",
          Line: line.lineNumber,
          Secret: finding.text,
          Type: finding.type,
        }))
      });
  });
  console.log(Table.print(resultsArr));
};

program
  .name("scan")
  .arguments("<path>")
  .description("Scan a file, directory, or remote git repo for secrets")
  .option("-b, --branch <name>", "Scan the git branch (specified path must be a git url)")
  .option("--secret-types <list>", "Secret types to scan for (from `radar list secrets`)")
  .option("--max-file-size <MiB>", "Don't scan any files larger than this")
  .option("--max-concurrent-file-reads <integer>", "The number of files to scan at once")
  .option("--max-findings-per-file <integer>", "Ignore files with more than this number of findings. This option is used to combat false positives.")
  .option("--include-files <list>", "File names to scan; overrides excluded files. Supports globs. Case-insensitive. Example: `--include-files \"yarn.lock\"`. See excluded files with `radar list defaults excludedFiles`")
  .option("--exclude-files <list>", "File names to exclude. Supports globs. Case-insensitive. Example: `--exclude-files \"test.*\"` to exclude all files named 'test' with any extension")
  .option("--include-dirs <list>", "Directory names to scan; overrides excluded directories. Supports globs. Case-insensitive. Example: `--include-dirs \"node_modules\"` to include 'node_modules' within the root directory. See excluded directories with `radar list defaults excludedDirectories`")
  .option("--exclude-dirs <list>", "Directory names to exclude. Supports globs. Case-insensitive. Example: `--exclude-dirs \"**/node_modules/\"` will exclude the 'node_modules' directory located in the root and any subdirectories. `--exclude-dirs \"node_modules/\"` will only exclude the 'node_modules' directory located in the root.")
  .option("--include-file-exts <list>", "File extensions to scan; overrides excluded file extensions. Supports globs. Case-insensitive. Example: `--include-file-exts \"*.txt,*.ini\"`. See excluded file extensions with `radar list defaults excludedFileExts`")
  .option("--exclude-file-exts <list>", "File extensions to exclude. Supports globs. Case-insensitive. Example: `--exclude-file-exts \"*.js,*example*\"` to exclude any file with an extension ending with '.js' (e.g. file.js, file.test.js) or containing 'example' (e.g. 'file.example', 'file.example.c', 'file.c.example')")
  .option("--custom-patterns <list>", "Custom regex patterns to search for. Case-sensitive. Example: `--custom-patterns \"\\.innerHTML *=\"` to detect directly setting an element's innerHTML property (a common XSS vector).")
  .option("--json", "Output results as json blob")
  .option("--no-progress", "Disable the progress bar")
  .action(async (...params) => {
    if (program.rawArgs.includes("--help")) {
      program.help();
      return;
    }

    const args = util.getCommandArgs(params);
    const requiredParams = program._args.map(({ name }) => name);
    if (args.length < requiredParams.length) {
      const missingParam = requiredParams[args.length];
      console.log(`Missing required <${missingParam}>`);
      program.help();
      return;
    }

    let path = args[0];
    const progressBar = new ProgressBar();
    const options = program.opts();
    const { json, progress, branch } = options;

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
      const onFilesToScan = progress ? (num) => { progressBar.init(num) } : () => {};
      const onFileScanned = progress ? () => { progressBar.increment() } : () => {};
      const radar = new Radar(generateRadarConfig(options), onFilesToScan, onFileScanned);
      printScanResults(await radar.scan(path), json)
    }
    catch(err) {
      console.error(err);
    }
  })
  .parse(process.argv);
