const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');

class ReadMe extends Classifier {
  constructor() {
    const tag = FileTags.README;
    const extensions = ['md'];

    super(tag, extensions);
  }

  isMatch(fileName, fileExt) {
    return (fileName === "readme") || (fileName.startsWith("readme") && super.isMatch(fileName, fileExt));
  }
}

const privateKey = new ReadMe();
module.exports = privateKey;
