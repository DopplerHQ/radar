class Secret {
  /**
   * @param {String} secret
   * @param {String} type
   */
  constructor(secret, type, metadata) {
    this._secret = secret;
    this._type = type;
    this._metadata = metadata;
  }

  secret() {
    return this._secret;
  }

  type() {
    return this._type;
  }

  metadata() {
    return this._metadata;
  }
}

module.exports = Secret;
