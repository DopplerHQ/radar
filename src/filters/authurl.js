const Filter = require('../objects/Filter');

class AuthURL extends Filter {
  constructor() {
    super('Auth URL');
  }

  checkMatch(term) {
    if (!term.includes('://') && !term.startsWith('//')) {
      return false;
    }

    const protocolIndex = term.indexOf('//');
    const authSeparatorIndex = term.indexOf(':', protocolIndex);
    const authPostfixIndex = term.indexOf('@');
    // an auth url will contain a ':' to separate the username and password, followed by a '@' to separate the auth creds and the domain
    if ((authSeparatorIndex === -1) || (authPostfixIndex === -1) || (authPostfixIndex < authSeparatorIndex)) {
      return false;
    }

    const domainPathSeparatorIndex = term.indexOf('/', protocolIndex + 2);
    // third '/' (if present) should separate domain and path, and thus come after the auth characters (':' and '@')
    if ((domainPathSeparatorIndex >= 0) && ((domainPathSeparatorIndex < authSeparatorIndex) || (domainPathSeparatorIndex < authPostfixIndex))) {
      return false;
    }

    return true;
  }
}

const filter = new AuthURL();
module.exports = filter;
