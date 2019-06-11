const { scanDirectory } = require('./index');

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

const dirPath = process.argv[2];
scanDirectory(dirPath)
  .then(result => console.dir(result, { depth: 3 } ))
  .catch(console.error);
