class Secret {
  /**
   * @param {String} secret
   * @param {String} type
   * @param {String} line
   * @param {Number} lineNumber
   */
  constructor(secret, type, line, lineNumber) {
    this._secret = secret;
    this._type = type;
    this._line = line;
    this._lineNumber = lineNumber;
  }

  secret() {
    return this._secret;
  }

  type() {
    return this._type;
  }

  line() {
    return this._line;
  }

  lineNumber() {
    return this._lineNumber;
  }
}

module.exports = Secret;
