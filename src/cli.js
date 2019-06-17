const program = require('commander');

const package = require('../package');
const Radar = require('./radar');
const Git = require('./git');
const Filesystem = require('./filesystem');

/**
TODO:

User configurable:
- max file size
- exclude extensions
- exclude files/directories
- include extensions
- include files/directories

 */

async function run() {
  program
    .version(package.version)
    .option("-p, --path <path>", "Scan the specified path")
    .option("-r, --repo <url>", "Scan the specied git repo url")
    .parse(process.argv);

  let { path } = program;
  const { repo } = program;

  if (repo) {
    const tempPath = await Filesystem.makeTempDirectory();
    await Git.clone(repo, tempPath)
    path = tempPath;
  }

  if (!path) {
    return Promise.reject("You must specify a path");
  }

  Radar.scan(path)
    .then(result => console.dir(result, { depth: 3 } ));
}

run()
  .catch((err) => console.error(err));
