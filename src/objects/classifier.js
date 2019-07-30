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

  isMatch(extension) {
    return this._extensions.reduce((acc, ext) => (
      acc || ext === extension || ext.endsWith(`.${extension}`)
    ), false)
  }
}

module.exports = Classifier;
