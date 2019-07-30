const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');

class Golang extends Classifier {
  constructor() {
    const tag = FileTags.GOLANG;
    const extensions = ['go', 'sum', 'mod'];

    super(tag, extensions);
  }
}

const privateKey = new Golang();
module.exports = privateKey;
