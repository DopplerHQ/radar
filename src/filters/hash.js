const Filter = require('../objects/Filter');

class Hash extends Filter {
  constructor() {
    super('Cryptographic Hash');

    // match common prefixed hash formats: md5-*, sha1-*, sha2-*, sha3-*, sha256-*, etc
    this.hashRegex = /^(md5|sha-?(1|2|3|[0-9]{3}))(-|:)?[a-z0-9\+/]+/i;
  }

  isMatch(term) {
    return this.hashRegex.test(term);
  }
}

const filter = new Hash();
module.exports = filter;
