const FilterWeights = require('../objects/filterweights');

const name = 'Auth URL';
const weight = FilterWeights.MAX;
const negativeWeight = FilterWeights.NONE;

function checkMatch(term) {
  return (term.includes('://') && term.includes('@')) ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
