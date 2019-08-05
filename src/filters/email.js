const Filter = require('../objects/Filter');

class EmailFilter extends Filter {
  constructor() {
    super('email');
    // match in this order: alphanumerics, underscores, periods, and hyphens (the user); @ sign; alphanumerics, underscores, periods, and hyphens (the domain); period; common TLDs
    // match must start at beginning of line or not be preceded by alphanumeric, underscore, hyphen, slash (/), or colon (:)
    // match must end at end of line or not be followed by alphanumeric, underscore, hyphen, slash (/), or colon (:)
    this.emailRegex = /(?:^|[^\w-\/:])(\w(?:(\.|-)?\w)+)@(\w(?:(\.|-)?\w)+)\.(com|org|net|gov|edu|uk|ru|de)(?:$|[^\w-\/:])/;
  }

  isMatch(term) {
    if (term.includes('mailto:')) {
      return true;
    }

    return this.emailRegex.test(term);
  }
}

const filter = new EmailFilter();
module.exports = filter;
