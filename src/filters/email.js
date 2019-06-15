const FilterWeights = require('../objects/filterweights');

const name = 'Email';
const weight = FilterWeights.MEDIUM;
const negativeWeight = FilterWeights.NONE;

function checkMatch(term) {
  // the simplest email regex will suffice
  const emailRegex = (/^\S+@\S+\.\S+$/);
  return emailRegex.test(term) ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
