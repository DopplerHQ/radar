const Filter = require('../objects/Filter');

const name = 'Repeating characters';
const name = 'Auth URL';

class CustomFilter extends Filter {
  checkMatch(term) {
    if ((term.match(/=/g) || []).length >= 3)
      return true;

    if ((term.match(/-/g) || []).length >= 4)
      return true;

    if ((term.match(/\\/g) || []).length >= 4)
      return true;

    if ((term.match(/\//g) || []).length >= 4)
      return true;

    if ((term.match(/\|/g) || []).length >= 4)
      return true;

    if ((term.match(/,/g) || []).length >= 4)
      return true;

    if (((term.match(/\[/g) || []).length >= 2) && ((term.match(/\]/g) || []).length >= 2))
      return true;

    if (((term.match(/\(/g) || []).length >= 2) && ((term.match(/\)/g) || []).length >= 2))
      return true;

    if (/__[a-z]+/.test(term)) {
      return true;
    }

    return false;
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
