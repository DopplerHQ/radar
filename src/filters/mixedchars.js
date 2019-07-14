const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');

const name = 'Mixed alphanumeric characters';
const weight = FilterWeights.HIGH;
const negativeWeight = FilterWeights.HIGH;

class CustomFilter extends Filter {
  checkMatch(term) {
    const containsLetters = term.match(/[a-zA-Z]/i);
    const containsNumbers = term.match(/[0-9]/i);

    const score = (containsLetters && containsNumbers) ? 1 : 0;
    return this._score(score);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
