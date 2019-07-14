const Filter = require('../objects/Filter');
const FilterWeights = require('../objects/filterweights');

const name = 'Entropy';
const weight = FilterWeights.VERYHIGH;
const negativeWeight = FilterWeights.VERYHIGH;

class CustomFilter extends Filter {
  checkMatch(term) {
    const entropy = this._calculateEntropy(term);
    if (entropy >= 5.5) return this._score(1);
    if (entropy >= 4.7) return this._score(.9);
    if (entropy >= 4) return this._score(.8);
    if (entropy >= 3.75) return this._score(.7);
    return this._score(0);
  }

  _calculateEntropy(str) {
    const occurrences = {};
    str.split('').forEach((char) => {
      const count = (occurrences[char] || 0);
      occurrences[char] = count + 1;
    });

    const strLength = str.length;
    return Object.keys(occurrences).reduce((acc, char) => {
      const count = occurrences[char];
      const probability = (count / strLength)
      return (acc + (probability * Math.log2(1 / probability)));
    }, 0);
  }
}

const filter = new CustomFilter(name, weight, negativeWeight);
module.exports = filter;
