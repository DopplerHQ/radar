const Filter = require('../objects/Filter');

const name = 'Identify cryptographic keys';

const PrivateKeyRegex = (/^.*(BEGIN ).*(PRIVATE KEY).*$/i);

class CryptoKeys extends Filter {
  checkMatch(term) {
    return PrivateKeyRegex.test(term);
  }
}

const filter = new CryptoKeys(name);
module.exports = filter;
