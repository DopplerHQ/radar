const File = require('./file');
const Key = require('./key');

class ScannedFile {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
    this._keys = [];
  }

  file() {
    return this._file;
  }

  keys() {
    return this._keys;
  }

  hasKeys() {
    return (this._keys.length !== 0);
  }

  /**
   * @param {Key} key
   */
  addKey(key) {
    this._keys.push(key);
  }

  toObject() {
    const object = {};
    object.metadata = {
      fileSize: this._file.size(),
      fileExtension: this._file.extension(),
    };
    object.keys = this._keys.map(key => ({
      key: key.key(),
      line: key.line(),
      lineNumber: key.lineNumber(),
      score: key.confidence(),
    }));
    return object;
  }
}

module.exports = ScannedFile;
