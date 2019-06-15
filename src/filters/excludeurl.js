const FilterWeights = require('../objects/filterweights');

const name = 'URL';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

function checkMatch(term) {
  const isURL = term.includes('://') && (!term.includes('@'));
  return isURL ? 0 : 1;
}

module.exports = { name, weight, negativeWeight, checkMatch };
