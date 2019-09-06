const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');

class PrivateKey extends Classifier {
  constructor() {
    const tag = FileTags.NO_EXTENSION;
    const extensions = [''];

    super(tag, extensions);
  }

  // override isMatch function since we can't easily check for a blank string with our glob library (micromatch)
  isMatch(fileName, fileExt) {
    return fileExt === "";
  }
}

const privateKey = new PrivateKey();
module.exports = privateKey;
