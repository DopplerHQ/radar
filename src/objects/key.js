class Key {
  /**
   * @param {String} key
   * @param {Number} line
   */
  constructor(key, line, confidence) {
    this._key = key;
    this._line = line;
    this._confidence = confidence;
  }

  key() {
    return this._key;
  }

  line() {
    return this._line;
  }

  confidence() {
    return this._confidence;
  }
}

module.exports = Key;
