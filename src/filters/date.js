const Filter = require('../objects/Filter');

class DateFilter extends Filter {
  constructor() {
    super('Date');

    // match and capture YYYY-MM-DD format
    this.YYYYMMDDRegex = /(?:^|\D)((?:1|2)\d{3})-(\d{2})-(\d{2})(?:$|\D)/;
  }

  isMatch(term) {
    const isYYYYMMDD = term.match(this.YYYYMMDDRegex);
    if (isYYYYMMDD !== null) {
      const year = isYYYYMMDD[1];
      const month = isYYYYMMDD[2];
      const day = isYYYYMMDD[3];

      if (month < 1 || month > 12)
        return false;
      if (day < 1 || day > 31)
        return false;

      return true;
    }

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
