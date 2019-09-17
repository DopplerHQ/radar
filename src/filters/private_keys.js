const Filter = require('../objects/Filter');

class PrivateKeys extends Filter {
  constructor() {
    super('Identify cryptographic private keys');

    this.beginPrivateKeyRegex = (/^.*BEGIN .{0,20}PRIVATE KEY.*$/i);
    this.endPrivateKeyRegex = (/^.*END .{0,20}PRIVATE KEY.*$/i);
  }

  isMatch(term) {
    return this.beginPrivateKeyRegex.test(term) || this.endPrivateKeyRegex.test(term);
  }
}

const filter = new PrivateKeys();
module.exports = filter;
