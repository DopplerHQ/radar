const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');

class PrivateKey extends Classifier {
  constructor() {
    const tag = FileTags.NO_EXTENSION;
    const extensions = [''];

    super(tag, extensions);
  }
}

const privateKey = new PrivateKey();
module.exports = privateKey;
