const Filter = require('../objects/Filter');

class MixedChars extends Filter {
  constructor() {
    super('Contains letters and numbers');

    this.lettersRegex = /[a-z]/i;
    this.numbersRegex = /[0-9]/;
  }

  isMatch(term) {
    const containsLetters = term.match(this.lettersRegex);
    if (containsLetters === null)
      return false;

    const containsNumbers = term.match(this.numbersRegex);
    if (containsNumbers === null)
      return false;

    return true;
  }
}

const filter = new MixedChars();
module.exports = filter;
