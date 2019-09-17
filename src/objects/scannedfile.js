const File = require('./file');
const Secret = require('./secret');

class ScannedFile {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
    this._results = {};
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
    return (Object.keys(this._results).length !== 0);
  }

  /**
   *
   * @param {String} secret
   * @param {String} type
   * @param {String} line
   * @param {Number} lineNumber
   * @param {Object} metadata
   */
  addSecret(secret, type, line, lineNumber, metadata = {}) {
    if (this._results[lineNumber] === undefined) {
      this._results[lineNumber] = {
        line,
        findings: [],
      };
    }

    const secretsOnLine = this._results[lineNumber];
    secretsOnLine.findings.push(new Secret(secret, type, metadata));
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
        numLines: this._file.numLines(),
      },
      lines: Object.keys(this._results).map((key) => {
        const value = this._results[key];
        return {
          line: value.line,
          lineNumber: Number(key),
          findings: value.findings.map(secret => ({
            text: secret.secret(),
            type: secret.type(),
            metadata: secret.metadata(),
          })),
        };
      })
    }
  }
}

module.exports = ScannedFile;
