const Filter = require('../objects/Filter');

class MixedChars extends Filter {
  constructor() {
    super('Contains letters and numbers');
  }

  isMatch(term) {
    const containsLetters = term.match(/[a-zA-Z]/);
    if (containsLetters === null)
      return false;

    const containsNumbers = term.match(/[0-9]/);
    if (containsNumbers === null)
      return false;

    return true;
  }
}

const filter = new MixedChars();
module.exports = filter;
