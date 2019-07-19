const Filter = require('../objects/Filter');

const name = 'Email';

const emailRegex = (/^\S+@\S+\.\S+$/);

class Email extends Filter {
  checkMatch(term) {
    return term.includes('mailto:') || emailRegex.test(term);
  }
}

const filter = new Email(name);
module.exports = filter;
