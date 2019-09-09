const globs = require('../globs');
const FileTags = require('./file_tags');

class Classifier {
  /**
   *
   * @param {FileTags} tag
   * @param {Array<String>} extensions
   */
  constructor(tag, extensions = []) {
    if (FileTags[tag] === undefined) {
      throw new Error("Tag is not valid");
    }

    this._tag = tag;
    this._extensions = extensions;
  }

  tag() {
    return this._tag;
  }

  /**
   *
   * @param {File} file
   */
  isMatch(file) {
    return globs.isMatch(file.extension().toLowerCase(), this._extensions)
  }
}

module.exports = Classifier;
