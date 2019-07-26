const File = require('./file');
const Secret = require('./secret');

class ScannedFile {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
    this._secrets = [];
    this._tags = new Set();
  }

  file() {
    return this._file;
  }

  secrets() {
    return this._secrets;
  }

  tags() {
    return this._tags;
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
   * @param {String} value
   */
  addTag(value) {
    this._tags.add(value);
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
