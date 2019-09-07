const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');

class EnvFile extends Classifier {
  constructor() {
    const tag = FileTags.ENV_FILE;
    const extensions = ['(|*).env'];

    super(tag, extensions);
  }
}

const envFile = new EnvFile();
module.exports = envFile;
