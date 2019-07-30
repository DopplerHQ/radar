const File = require('./file');
const Secret = require('./secret');

class ScannedFile {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
    this._secrets = {};
    // used for tags identified by the static file classifier. these tags cannot be removed
    this._fileTags = new Set();
    // used for tags identified during run time. these tags can be removed
    this._runtimeTags = new Set();
  }

  file() {
    return this._file;
  }

  tags() {
    return new Set([...this._fileTags, ...this._runtimeTags]);
  }

  hasSecrets() {
    return (Object.keys(this._secrets).length !== 0);
  }

  /**
   *
   * @param {String} secret
   * @param {String} type
   * @param {String} line
   * @param {Number} lineNumber
   */
  addSecret(secret, type, line, lineNumber) {
    if (this._secrets[lineNumber] === undefined) {
      this._secrets[lineNumber] = {
        line,
        secrets: [],
      };
    }

    const secretsOnLine = this._secrets[lineNumber];
    secretsOnLine.secrets.push(new Secret(secret, type));
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
        size: this._file.size(),
        extension: this._file.extension(),
      },
      results: Object.keys(this._secrets).map((key) => {
        const value = this._secrets[key];
        return {
          line: value.line,
          lineNumber: parseInt(key),
          findings: value.secrets.map(secret => ({
            text: secret.secret(),
            type: secret.type(),
          })),
        };
      })
    }
  }
}

module.exports = ScannedFile;
