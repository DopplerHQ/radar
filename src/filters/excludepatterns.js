const FilterWeights = require('../objects/filterweights');

const name = 'Exclusion patterns';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

function checkMatch(term) {
  // allow up to two equals signs for base64 encoding
  const matchesRule = (term.match(/=/g) || []).length > 2;
  // we want to exclude paths, so treat a match as a negative case
  return matchesRule ? 0 : 1;
}

module.exports = { name, weight, negativeWeight, checkMatch };