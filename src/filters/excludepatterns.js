const FilterWeights = require('../objects/filterweights');

const name = 'Exclusion patterns';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

function checkMatch(term) {
  // allow up to two equals signs for base64 encoding
  const hasManyEqualsSigns = (term.match(/=/g) || []).length > 2;
  // two colons is a common class separator
  const hasDoubleColonSeparator = (/[a-zA-Z0-9]::[a-zA-Z0-9]/g).test(term);
  // we want to exclude paths, so treat a match as a negative case
  return (hasManyEqualsSigns || hasDoubleColonSeparator) ? 0 : 1;
}

module.exports = { name, weight, negativeWeight, checkMatch };
