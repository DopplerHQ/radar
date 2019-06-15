const FilterWeights = require('../objects/filterweights');

const name = 'Length';
const weight = FilterWeights.MEDIUM;
const negativeWeight = FilterWeights.LOW;

function checkMatch(term) {
  if (term.length >= 32) {
    return 1;
  }

  if (term.length >= 24) {
    return .85;
  }

  if (term.length >= 15) {
    return .7;
  }

  return 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
