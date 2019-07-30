const File = require('./file');
const Secret = require('./secret');

class ScannedFile {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
    this._secrets = [];
    // used for tags identified by the static file classifier. these tags cannot be removed
    this._fileTags = new Set();
    // used for tags identified during run time. these tags can be removed
    this._runtimeTags = new Set();
  }

  file() {
    return this._file;
  }

  secrets() {
    return this._secrets;
  }

  tags() {
    return new Set([...this._fileTags, ...this._runtimeTags]);
  }

  hasSecrets() {
    return (this._secrets.length !== 0);
  }

  /**
   *
   * @param {String} secret
   * @param {String} type
   * @param {String} line
   * @param {Number} lineNumber
   */
  addSecret(secret, type, line, lineNumber) {
    this._secrets.push(new Secret(secret, type, line, lineNumber));
  }

   /**
    *
    * @param {FileTags} tag
    * @param {boolean} isFileTag File tags cannot be removed; runtime tags can be removed
    */
  addTag(tag, isFileTag = false) {
    if (isFileTag) {
      this._fileTags.add(tag);
    }
    else {
      this._runtimeTags.add(tag);
    }
  }

  /**
   *
   * @param {FileTags} tag
   */
  deleteTag(tag) {
    this._runtimeTags.delete(tag);
  }

  toObject() {
    return {
      metadata: {
        fileSize: this._file.size(),
        fileExtension: this._file.extension(),
      },
      secrets: this._secrets.map(secret => ({
        secret: secret.secret(),
        type: secret.type(),
        line: secret.line(),
        lineNumber: secret.lineNumber(),
      }))
    }
  }
}

module.exports = ScannedFile;
