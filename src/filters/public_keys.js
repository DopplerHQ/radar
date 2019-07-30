const Filter = require('../objects/Filter');

class PublicKeys extends Filter {
  constructor() {
    super('Identify cryptographic public keys');

    this.beginPublicKeyRegex = (/^.*BEGIN .*(?:PUBLIC KEY|CERTIFICATE).*$/i);
    this.endPublicKeyRegex = (/^.*END .*(?:PUBLIC KEY|CERTIFICATE).*$/i);
  }

  isMatch(term) {
    return this.beginPublicKeyRegex.test(term) || this.endPublicKeyRegex.test(term);
  }
}

const filter = new PublicKeys();
module.exports = filter;
