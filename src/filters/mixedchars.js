const Filter = require('../objects/Filter');

const name = 'Contains letters and numbers';

class CustomFilter extends Filter {
  checkMatch(term) {
    const containsLetters = term.match(/[a-zA-Z]/);
    if (containsLetters === null)
      return false;

    const containsNumbers = term.match(/[0-9]/);
    if (containsNumbers === null)
      return false;

    return true;
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
