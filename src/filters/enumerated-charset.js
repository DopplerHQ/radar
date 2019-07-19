const Filter = require('../objects/Filter');

const name = 'Enumerated Charset';

class CustomFilter extends Filter {
  checkMatch(term) {
    return term.includes('abcdefghijklmnopqrstuvwxyz') || term.includes('123456789');
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
