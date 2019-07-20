const Filter = require('../objects/Filter');

const emailRegex = (/^\S+@\S+\.\S+$/);

class Email extends Filter {
  constructor() {
    super('Email');
  }

  checkMatch(term) {
    return term.includes('mailto:') || emailRegex.test(term);
  }
}

const filter = new Email();
module.exports = filter;
