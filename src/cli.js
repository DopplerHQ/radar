const program = require('commander');

const package = require('../package');
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


function getConfig(program) {
  const { maxFileSize, minMatchScore, includeFileExts, excludeFileExts } = program;
  const config = new Config();

  if (maxFileSize) {
    config.setMaxFileSizeMiB(maxFileSize);
  }

  if (minMatchScore) {
    config.setMinMatchScore(minMatchScore);
  }

  if (includeFileExts) {
    config.setIncludedFileExts(includeFileExts.split(",").map(ext => ext.trim()));
  }

  if (excludeFileExts) {
    config.setExcludedFileExts(excludeFileExts.split(",").map(ext => ext.trim()));
  }

  return config;
}

return Promise.resolve()
  .then(async () => {
    program
      .name("radar")
      .version(package.version)
      .option("-p, --path <path>", "Scan the specified path")
      .option("-r, --repo <url>", "Scan the specified git repo url")
      .option("-b, --branch <name>", "Scan the specified git branch")
      .option("--max-file-size <MiB>", "Maximum size of files to scan")
      .option("--min-match-score <number>", "Minimum score for a token to be considered a match, between 0 and 1. Defaults to .7")
      .option("--include-file-exts <list>", "File extensions to include")
      .option("--exclude-file-exts <list>", "File extensions to exclude (e.g. \"json, map, csv\")")
      .parse(process.argv);

    let { path } = program;
    const { repo, branch } = program;

    if (repo) {
      const tempPath = await Filesystem.makeTempDirectory();
      await Git.clone(repo, tempPath, branch);
      path = tempPath;
    }

    if (!path) {
      return Promise.reject("You must specify a path or repo");
    }

    const config = getConfig(program);
    const radar = new Radar(config);
    return radar.scan(path);
  })
    .then(result => console.dir(result, { depth: 3 } ))
    .catch((err) => console.error(err));
