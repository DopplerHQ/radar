class Secret {
  /**
   * @param {String} secret
   * @param {String} type
   * @param {String} line
   * @param {Number} lineNumber
   */
  constructor(secret, type) {
    this._secret = secret;
    this._type = type;
  }

  secret() {
    return this._secret;
  }

  type() {
    return this._type;
  }
}

module.exports = Secret;
