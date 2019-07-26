const Filter = require('../objects/Filter');

class Email extends Filter {
  constructor() {
    super('Email');

    // simplest email regex (i.e. *@*.*)
    this.emailRegex = /^\S+@\S+\.\S+$/;
  }

  isMatch(term) {
    return term.includes('mailto:') || this.emailRegex.test(term);
  }
}

const filter = new Email();
module.exports = filter;
