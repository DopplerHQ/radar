const FilterWeights = require('../objects/filterweights');

const name = 'Email';
const weight = FilterWeights.MEDIUM;
const negativeWeight = FilterWeights.NONE;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

function checkMatch(term) {
  // the simplest email regex will suffice
  const emailRegex = (/^\S+@\S+\.\S+$/);
  const score = emailRegex.test(term) ? 1 : 0;
  return returnObj(score);
}

module.exports = { name, checkMatch };
