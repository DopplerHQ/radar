const Filter = require('../objects/Filter');

class Base64 extends Filter {
  constructor() {
    super('Base64 Encoded');
  }

  isMatch(term) {
    return term.endsWith('=');
  }
}

const filter = new Base64();
module.exports = filter;
