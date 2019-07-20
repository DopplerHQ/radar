const Filter = require('../objects/Filter');

const name = 'Auth URL';

class CustomFilter extends Filter {
  constructor(name) {
    super(name);

    this.minLength = 20;
  }

  checkMatch(term) {
    return term.length >= this.minLength;
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
