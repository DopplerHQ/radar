const FilterWeights = require('../objects/filterweights');

const name = 'Auth URL';
const weight = FilterWeights.MAX;
const negativeWeight = FilterWeights.NONE;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

function checkMatch(term) {
  if (!term.includes('://') && !term.startsWith('//')) {
    return returnObj(0);
  }

  const protocolIndex = term.indexOf('//');
  const authSeparatorIndex = term.indexOf(':', protocolIndex);
  const authPostfixIndex = term.indexOf('@');
  // an auth url will contain a ':' to separate the username and password, followed by a '@' to separate the auth creds and the domain
  if ((authSeparatorIndex === -1) || (authPostfixIndex === -1) || (authPostfixIndex < authSeparatorIndex)) {
    return returnObj(0);
  }

  const domainPathSeparatorIndex = term.indexOf('/', protocolIndex + 2);
  // third '/' (if present) should separate domain and path, and thus come after the auth characters (':' and '@')
  if ((domainPathSeparatorIndex >= 0) && ((domainPathSeparatorIndex < authSeparatorIndex) || (domainPathSeparatorIndex < authPostfixIndex))) {
    return returnObj(0);
  }

  return returnObj(1);
}

module.exports = { name, checkMatch };
