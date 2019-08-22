const Classifier = require('../src/objects/classifier');
const FileTags = require('../src/objects/file_tags');

class ExampleClassifier extends Classifier {
  constructor() {
    // this isn't a real file tag
    const tag = FileTags.TEST_FILE;
    // apply the tag to any files with an extension that ends with 'test'
    const extensions = ['test'];
    super(tag, extensions);
  }
}

const classifier = new ExampleClassifier();
module.exports = classifier;
