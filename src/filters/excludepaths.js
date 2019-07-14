const FilterWeights = require('../objects/filterweights');

const name = 'Exclude file paths';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

function returnObj(score) {
  return {
    score,
    weight: (score === 0) ? negativeWeight : weight,
  };
}

function checkMatch(term) {
  const hasPathNavigation = (term.includes('../') || term.includes('./') || term.includes('C:\\\\') || term.includes('c:\\\\'));
  const hasMultiplePathSeparators = (!term.includes('://') && ((term.match(/\//g) || []).length >= 2));
  // we want to exclude paths, so treat a match as a negative case
  const score = (hasPathNavigation || hasMultiplePathSeparators) ? 0 : 1;
  return returnObj(score);
}

module.exports = { name, checkMatch };
