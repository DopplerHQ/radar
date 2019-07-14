const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');
const AuthUrlFilter = require('./authurl');

const name = 'URL';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

class CustomFilter extends Filter {
  /**
   * Exclude urls that don't explicitly include auth credentials
   * @param {String} term
   */
  checkMatch(term) {
    const isUrl = term.includes('://') || term.startsWith('//');
    if (!isUrl) {
      return this._score(1);
    }

    const isAuthUrl = AuthUrlFilter.checkMatch(term);
    if (isAuthUrl.score !== 0) {
      return this._score(1);
    }

    return this._score(0);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
