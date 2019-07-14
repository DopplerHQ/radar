const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');

const name = 'Exclusion patterns';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

class CustomFilter extends Filter {
  checkMatch(term) {
    // allow up to two equals signs for base64 encoding
    const hasManyEqualsSigns = (term.match(/=/g) || []).length > 2;
    // two colons is a common class separator
    const hasDoubleColonSeparator = (/[a-zA-Z0-9]::[a-zA-Z0-9]/g).test(term);
    // we want to exclude paths, so treat a match as a negative case
    const score = (hasManyEqualsSigns || hasDoubleColonSeparator) ? 0 : 1;
    return this._score(score);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
