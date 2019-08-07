const Filter = require('../objects/Filter');

class EnumeratedCharset extends Filter {
  constructor() {
    super('Enumerated Charset');
  }

  isMatch(term) {
    return term.includes('123456789')
        || term.includes('123456')
        || term.includes('456789')
        || term.includes('abcdefghijklmnopqrstuvwxyz')
        || term.includes('abcdef')
        || term.includes('defghi')
        || term.includes('ghijkl')
        || term.includes('lmnopq')
        || term.includes('opqrst')
        || term.includes('rstuvw')
        || term.includes('uvwxyz');
  }
}

const filter = new EnumeratedCharset();
module.exports = filter;
