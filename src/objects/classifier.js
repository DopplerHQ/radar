const micromatch = require('micromatch');
const FileTags = require('./file_tags');

const MicroMatchOptions = { nocase: true };

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

  isMatch(fileName, fileExt) {
    return micromatch.isMatch(fileExt, this._extensions, MicroMatchOptions)
  }
}

module.exports = Classifier;
