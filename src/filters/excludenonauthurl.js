const FilterWeights = require('../objects/filterweights');
const AuthUrlFilter = require('./authurl');

const name = 'URL';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

/**
 * Exclude urls that don't explicitly include auth credentials
 * @param {String} term
 */
function checkMatch(term) {
  const isUrl = term.includes('://') || term.startsWith('//');
  if (!isUrl) {
    return returnObj(1);
  }

  const isAuthUrl = AuthUrlFilter.checkMatch(term);
  if (isAuthUrl.score !== 0) {
    return returnObj(1);
  }

  return returnObj(0);
}

module.exports = { name, checkMatch };
