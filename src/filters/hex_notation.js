const Filter = require('../objects/Filter');

class HexNotation extends Filter {
  constructor() {
    super('Hex Notation');

    // case-sensitive, 0x should always be lowercase
    this.hexNotation = /0x[a-fA-F0-9]/;
  }

  isMatch(term) {
    return this.hexNotation.test(term);
  }
}

const filter = new HexNotation();
module.exports = filter;
