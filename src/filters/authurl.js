const Filter = require('../objects/Filter');

class AuthURL extends Filter {
  constructor() {
    super('Auth URL');

    this.otpAuthRegex = /otpauth:\/\/\w+/;
    // look for protocol (//), username (any chars except / : @ .), colon (:), password (any chars except / : @ .), @ symbol
    this.authUrlRegex = /\/\/([^/:@.]{3,}):([^/:@.]{3,})@/;
  }

  isMatch(term) {
    if (this.otpAuthRegex.test(term)) {
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
    return !this.isVariable(authUsername) && !this.isVariable(authPassword);
  }

  isVariable(text) {
    return text.startsWith('$') || text.startsWith('#')
      || (text.startsWith('{') && text.endsWith('}'))
      || (text.startsWith('<') && text.endsWith('>'))
      || (/^\*+$/.test(text));
  }
}

const filter = new AuthURL();
module.exports = filter;
