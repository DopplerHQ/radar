const { scan } = require('./radar');

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
  const path = process.argv[2];
  scan(path)
    .then(result => console.dir(result, { depth: 3 } ))
    .catch(console.error);
}

run();
