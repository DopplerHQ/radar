const Filter = require('../objects/Filter');

class RepeatingCharacters extends Filter {
  constructor() {
    super('Repeating characters');
  }

  isMatch(term) {
    if (term.includes("..."))
      return true;

    if ((term.match(/=/g) || []).length >= 3)
      return true;


    if ((term.match(/\\/g) || []).length >= 4)
      return true;


    if ((term.match(/\|/g) || []).length >= 4)
      return true;

    if ((term.match(/,/g) || []).length >= 4)
      return true;

    if (((term.match(/\[/g) || []).length >= 2) && ((term.match(/\]/g) || []).length >= 2))
      return true;

    if (((term.match(/\(/g) || []).length >= 2) && ((term.match(/\)/g) || []).length >= 2))
      return true;

    if ((term.match(/\(/g) || []).length >= 4)
      return true;

    if ((term.match(/\)/g) || []).length >= 4)
      return true;

    if (/__[a-z]+/.test(term)) {
      return true;
    }

    return false;
  }
}

const filter = new RepeatingCharacters();
module.exports = filter;
