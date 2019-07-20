const Filter = require('../objects/Filter');

class Entropy extends Filter {
  constructor() {
    super('Entropy');
    this.minEntropy = 3.75;
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

const filter = new Entropy();
module.exports = filter;
