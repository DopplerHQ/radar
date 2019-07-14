const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');

const name = 'Length';
const weight = FilterWeights.HIGH;
const negativeWeight = FilterWeights.MAX;

class CustomFilter extends Filter {
  checkMatch(term) {
    if (term.length >= 32) {
      return this._score(1);
    }

    if (term.length >= 24) {
      return this._score(.85);
    }

    if (term.length >= 15) {
      return this._score(.7);
    }

    return this._score(0);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
