const fs = require('fs');
const path = require('path');

const FileTags = require('./objects/file_tags');

class FileClassifier {
  constructor() {
    const classifiersPath = path.resolve(__dirname, 'classifiers')
    // NOTE this will execute synchronously on this file's initial load
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
      classifier.isMatch(file.name().toLowerCase(), file.extension().toLowerCase())
    ))
      .map(classifier => classifier.tag());
  }
}

const fileClassifier = new FileClassifier();
module.exports = fileClassifier;
