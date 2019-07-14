const FilterWeights = require('../objects/filterweights');

const name = 'Length';
const weight = FilterWeights.HIGH;
const negativeWeight = FilterWeights.MAX;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

function checkMatch(term) {
  if (term.length >= 32) {
    return returnObj(1);
  }

  if (term.length >= 24) {
    return returnObj(.85);
  }

  if (term.length >= 15) {
    return returnObj(.7);
  }

  return returnObj(0);
}

module.exports = { name, checkMatch };
