const FilterWeights = require('../objects/filterweights');

const name = 'Mixed alphanumeric characters';
const weight = FilterWeights.HIGH;
const negativeWeight = FilterWeights.HIGH;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

function checkMatch(term) {
  const containsLetters = term.match(/[a-zA-Z]/i);
  const containsNumbers = term.match(/[0-9]/i);

  const score = (containsLetters && containsNumbers) ? 1 : 0;
  return returnObj(score);
}

module.exports = { name, checkMatch };
