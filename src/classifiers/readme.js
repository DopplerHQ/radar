const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');

class ReadMe extends Classifier {
  constructor() {
    const tag = FileTags.README;
    const extensions = ['*.md'];

    super(tag, extensions);
  }

  isMatch(file) {
    const fileName = file.name().toLowerCase();
    return (fileName === "readme") || (fileName.startsWith("readme") && super.isMatch(file));
  }
}

const privateKey = new ReadMe();
module.exports = privateKey;
