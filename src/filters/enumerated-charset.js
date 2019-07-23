const Filter = require('../objects/Filter');

class EnumeratedCharset extends Filter {
  constructor() {
    super('Enumerated Charset');
  }

  isMatch(term) {
    return term.includes('abcdefghijklmnopqrstuvwxyz') || term.includes('123456789');
  }
}

const filter = new EnumeratedCharset();
module.exports = filter;
