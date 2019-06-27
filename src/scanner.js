const fs = require('fs');
const path = require('path');

// a-z A-Z 0-9 . @ + = - _ : / \
const validCharactersRegex = (/[a-zA-Z0-9\.@+=-_:\/\\]/);

const filtersPath = path.resolve(__dirname, 'filters')
const Filters = [];
// NOTE this will execute synchronously on this file's initial load
fs.readdirSync(filtersPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const filter = require(filtersPath + '/' + file);
    Filters.push(filter);
  }
});

class Scanner {
  static isValidCharacter(char) {
    return validCharactersRegex.test(char);
  }

  static preFilter(text) {
    return text.split('').map(char => (this.isValidCharacter(char) ? char : ' ')).join('');
  }

  /**
   * Scores a term with each filter
   * @param {String} term
   * @param {Array<Filters} filters
   * @returns Array of objects representing each filter's score
   */
  static scoreTerm(term, filters) {
    return filters.map((filter) => {
      const { name, weight, negativeWeight } = filter;
      const score = filter.checkMatch(term);

      return {
        name,
        weight,
        negativeWeight,
        score,
      };
    });
  }

  static calculateConfidence(filterScores) {
    let totalWeight = 0;
    let weightedScore = 0;

    filterScores.forEach(((filterScore) => {
      const { score, weight, negativeWeight } = filterScore;
      if (score === 0) {
        totalWeight += negativeWeight;
      }
      else {
        totalWeight += weight;
        weightedScore += (weight * score);
      }
    }))

    return (weightedScore / totalWeight);
  }

  static findKeys(line, minScore) {
    const keys = [];
    const terms = this.preFilter(line).split(/ +/);
    terms.forEach((term) => {
      const filterScores = this.scoreTerm(term, Filters);
      const confidence = this.calculateConfidence(filterScores);

      if (confidence < minScore) {
        return;
      }

      keys.push({
        term,
        filterScores,
        confidence,
      });
    });
    return keys;
  }
}

module.exports = Scanner;
