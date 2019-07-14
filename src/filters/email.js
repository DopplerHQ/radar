const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');

const name = '';
const weight = FilterWeights.MEDIUM;
const negativeWeight = FilterWeights.NONE;

class CustomFilter extends Filter {
  checkMatch(term) {
    // the simplest email regex will suffice
    const emailRegex = (/^\S+@\S+\.\S+$/);
    const score = emailRegex.test(term) ? 1 : 0;
    return this._score(score);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
