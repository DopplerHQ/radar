const Filter = require('../objects/Filter');

class DateFilter extends Filter {
  constructor() {
    super('Date');
  }

  checkMatch(term) {
    try {
      const date = new Date(term);
      return date.toISOString() === term;
    }
    catch(err) {
      return false;
    }
  }
}

const filter = new DateFilter();
module.exports = filter;
