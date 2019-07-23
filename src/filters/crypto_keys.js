const Filter = require('../objects/Filter');

class CryptoKeys extends Filter {
  constructor() {
    super('Identify cryptographic keys');

    this.beginPrivateKeyRegex = (/^.*(BEGIN ).*(PRIVATE KEY).*$/i);
    this.endPrivateKeyRegex = (/^.*(END ).*(PRIVATE KEY).*$/i);
  }

  isMatch(term) {
    return this.beginPrivateKeyRegex.test(term) || this.endPrivateKeyRegex.test(term);
  }
}

const filter = new CryptoKeys();
module.exports = filter;
