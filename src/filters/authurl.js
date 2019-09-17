const Filter = require('../objects/Filter');

class AuthURL extends Filter {
  constructor() {
    super('Auth URL');

    // look for protocol (//), username (any chars except / : @ .), colon (:), password (any chars except / : @ .), @ symbol
    this.authUrlRegex = /\/\/([^/:@.]{3,}):([^/:@.]{3,})@/;
  }

  isMatch(term) {
    if (term.includes("otpauth://")) {
      return true;
    }

    if (!term.includes('://') && !term.startsWith('//')) {
      return false;
    }

    const isAuthUrl = term.match(this.authUrlRegex);
    if (isAuthUrl === null) {
      return false;
    }

    const authUsername = isAuthUrl[1];
    const authPassword = isAuthUrl[2];
    return !AuthURL.isVariable(authUsername) && !AuthURL.isVariable(authPassword);
  }

  static isVariable(text) {
    return text.startsWith('$') || text.startsWith('#')
      || (text.startsWith('{') && text.endsWith('}'))
      || (text.startsWith('<') && text.endsWith('>'));
  }
}

const filter = new AuthURL();
module.exports = filter;
