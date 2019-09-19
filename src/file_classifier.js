const fs = require('fs');
const path = require('path');

const File = require('./objects/file');
const FileTags = require('./objects/file_tags');

class FileClassifier {
  constructor() {
    const classifiersPath = path.resolve(__dirname, 'classifiers')
    // NOTE this will execute synchronously
    this.classifiers = fs.readdirSync(classifiersPath)
      .filter(file => file.endsWith('.js'))
      .map(file => require(path.join(classifiersPath, file)));
  }

  /**
   *
   * @param {File} file
   * @returns {Array<FileTags>}
   */
  classify(file) {
    return this.classifiers.filter(classifier => (
      classifier.isMatch(file)
    ))
      .map(classifier => classifier.tag());
  }
}

const fileClassifier = new FileClassifier();
module.exports = fileClassifier;
