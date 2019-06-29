class Key {
  /**
   * @param {String} key
   * @param {String} line
   * @param {Number} lineNumber
   * @param {Number} confidence
   */
  constructor(key, line, lineNumber, confidence) {
    this._key = key;
    this._line = line;
    this._lineNumber = lineNumber;
    this._confidence = confidence;
  }

  key() {
    return this._key;
  }

  line() {
    return this._line;
  }

  lineNumber() {
    return this._lineNumber;
  }

  confidence() {
    return this._confidence;
  }
}

module.exports = Key;
