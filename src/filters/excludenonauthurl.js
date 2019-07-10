const FilterWeights = require('../objects/filterweights');
const AuthUrlFilter = require('./authurl');

const name = 'URL';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

/**
 * Exclude urls that don't explicitly include auth credentials
 * @param {String} term
 */
function checkMatch(term) {
  const isUrl = term.includes('://') || term.startsWith('//');
  if (!isUrl) {
    return 1;
  }

  const isAuthUrl = AuthUrlFilter.checkMatch(term);
  if (isAuthUrl) {
    return 1;
  }

  return 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
