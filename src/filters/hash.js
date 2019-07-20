const Filter = require('../objects/Filter');

const hashRegex = /^(md5|sha-?(1|2|3|[0-9]{3}))(-|:)?/i;

class Hash extends Filter {
  constructor() {
    super('Cryptographic Hash');
  }

  checkMatch(term) {
    return hashRegex.test(term);
  }
}

const filter = new Hash();
module.exports = filter;
