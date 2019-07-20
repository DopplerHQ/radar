const Filter = require('../objects/Filter');

const PrivateKeyRegex = (/^.*(BEGIN ).*(PRIVATE KEY).*$/i);

class CryptoKeys extends Filter {
  constructor() {
    super('Identify cryptographic keys');
  }

  checkMatch(term) {
    return PrivateKeyRegex.test(term);
  }
}

const filter = new CryptoKeys();
module.exports = filter;
