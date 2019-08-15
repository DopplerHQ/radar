const Filter = require('../objects/Filter');

class AuthURL extends Filter {
  constructor() {
    super('Auth URL');

    // look for protocol (//), username (any chars except / : @ .), colon (:), password (any chars except / : @ .), @ symbol
    this.authUrlRegex = /\/\/[^\/:@\.]{3,}:[^\/:@\.]{3,}@/;
  }

  isMatch(term) {
    if (!term.includes('://') && !term.startsWith('//')) {
      return false;
    }

    return term.includes("otpauth://") || this.authUrlRegex.test(term);
  }
}

const filter = new AuthURL();
module.exports = filter;
