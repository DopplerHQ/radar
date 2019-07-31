const Filter = require('../objects/Filter');

class AuthURL extends Filter {
  constructor() {
    super('Auth URL');

    // look for protocol, username, colon, password, @ sign, and optional domain
    this.authUrlRegex = /\/\/.+:.+@.*\/?/;
  }

  isMatch(term) {
    if (!term.includes('://') && !term.startsWith('//')) {
      return false;
    }

    return this.authUrlRegex.test(term);
  }
}

const filter = new AuthURL();
module.exports = filter;
