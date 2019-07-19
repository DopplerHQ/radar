const Filter = require('../objects/Filter');

const name = 'Entropy';

class CustomFilter extends Filter {
  constructor(name) {
    super(name);
    this.minEntropy = 4;
  }
  checkMatch(term) {
    const entropy = this._calculateEntropy(term);
    return entropy >= this.minEntropy;
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

const filter = new CustomFilter(name);
module.exports = filter;
