const program = require('commander');
const Table = require('easy-table');

const Radar = require('../radar');
const Filesystem = require('../filesystem');
const Git = require('../git');
const ProgressBar = require('../progressbar');
const util = require('./util');

const generateRadarConfig = (options)  =>{
  const { secretTypes, maxFileSize, includeFiles, excludeFiles, includeDirs, excludeDirs, includeFileExts, excludeFileExts } = options;

  return {
    secretTypes: secretTypes ? util.parseStringArray(secretTypes) : undefined,
    maxFileSizeMiB: maxFileSize,
    includedFiles: includeFiles ? util.parseStringArray(includeFiles) : undefined,
    excludedFiles: excludeFiles ? util.parseStringArray(excludeFiles) : undefined,
    includedDirectories: includeDirs ? util.parseStringArray(includeDirs) : undefined,
    excludedDirectories: excludeDirs ? util.parseStringArray(excludeDirs) : undefined,
    includedFileExts: includeFileExts ? util.parseStringArray(includeFileExts) : undefined,
    excludedFileExts: excludeFileExts ? util.parseStringArray(excludeFileExts) : undefined,
  };
};

const printScanResults = (results, json = false) => {
  if (json) {
    console.dir(results, { depth: 5 } );
    return;
  }

  if (Object.keys(results).length === 0) {
    console.log("No secrets detected");
    return;
  }

  // print results table
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
};

program
  .name("scan")
  .arguments("<path>")
  .description("Scan a file, directory, or remote git repo for secrets")
  .option("-b, --branch <name>", "Scan the git branch (specified path must be a git url)")
  .option("--secret-types <list>", "Secret types to scan for (from `radar list secrets`)")
  .option("--max-file-size <MiB>", "Don't scan any files larger than this")
  .option("--include-files <list>", "File names to include (case-insensitive). Overrides excluded files. See `doppler list defaults includedFiles`")
  .option("--exclude-files <list>", "File names to exclude (case-insensitive). See `doppler list defaults excludedFiles`)")
  .option("--include-dirs <list>", "Directory names to include (case-insensitive). Overrides excluded directories. See `doppler list defaults includedDirectories`")
  .option("--exclude-dirs <list>", "Directory names to exclude (case-insensitive). See `doppler list defaults excludedFiles`)")
  .option("--include-file-exts <list>", "File extensions to include (case-insensitive). Overrides excluded file extenesions. See `doppler list defaults includedFileExts`")
  .option("--exclude-file-exts <list>", "File extensions to exclude (case-insensitive). See `doppler list defaults excludedFileExts`)")
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
