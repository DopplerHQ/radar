const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');

const name = 'Auth URL';
const weight = FilterWeights.MAX;
const negativeWeight = FilterWeights.NONE;

class CustomFilter extends Filter {
  checkMatch(term) {
    if (!term.includes('://') && !term.startsWith('//')) {
      return this._score(0);
    }

    const protocolIndex = term.indexOf('//');
    const authSeparatorIndex = term.indexOf(':', protocolIndex);
    const authPostfixIndex = term.indexOf('@');
    // an auth url will contain a ':' to separate the username and password, followed by a '@' to separate the auth creds and the domain
    if ((authSeparatorIndex === -1) || (authPostfixIndex === -1) || (authPostfixIndex < authSeparatorIndex)) {
      return this._score(0);
    }

    const domainPathSeparatorIndex = term.indexOf('/', protocolIndex + 2);
    // third '/' (if present) should separate domain and path, and thus come after the auth characters (':' and '@')
    if ((domainPathSeparatorIndex >= 0) && ((domainPathSeparatorIndex < authSeparatorIndex) || (domainPathSeparatorIndex < authPostfixIndex))) {
      return this._score(0);
    }

    return this._score(1);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
