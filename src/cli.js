const program = require('commander');

const package = require('../package');
const Radar = require('./radar');

if (process.argv.length <= 2) {
  console.error("You must specify a directory");
  process.exit(1);
}

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
    .parse(process.argv);

  const { path } = program;
  if (!path) {
    return Promise.reject("You must specify a path");
  }

  Radar.scan(path)
    .then(result => console.dir(result, { depth: 3 } ));
}

run()
  .catch((err) => console.error(err));
