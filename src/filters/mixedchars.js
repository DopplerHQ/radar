const FilterWeights = require('../objects/filterweights');

const name = 'Mixed alphanumeric characters';
const weight = FilterWeights.MEDIUM;
const negativeWeight = FilterWeights.MEDIUM;

function checkMatch(term) {
  const containsLetters = term.match(/[a-zA-Z]/i);
  const containsNumbers = term.match(/[0-9]/i);

  return (containsLetters && containsNumbers) ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
