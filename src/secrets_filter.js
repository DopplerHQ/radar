const fs = require('fs');
const path = require('path');

// a-z A-Z 0-9 . @ + = - _ : / #
const validCharactersRegex = (/[a-zA-Z0-9\.@+=-_:\/#]/);

const filtersPath = path.resolve(__dirname, 'filters')
const Filters = [];
// NOTE this will execute synchronously on this file's initial load
fs.readdirSync(filtersPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const filter = require(filtersPath + '/' + file);
    Filters.push(filter);
  }
});

class SecretsFilter {
  static isValidCharacter(char) {
    return validCharactersRegex.test(char);
  }

  static preFilter(text) {
    return text.split('').map(char => (SecretsFilter.isValidCharacter(char) ? char : ' ')).join('');
  }

  /**
   * Calculate a term's score against each each filter
   * @param {String} term
   * @param {Array<Filter>} filters
   * @returns Array of objects representing each filter's score
   */
  static scoreTerm(term, filters) {
    return filters.map((filter) => {
      const { name } = filter;
      const results = filter.checkMatch(term);

      return {
        name,
        weight: results.weight,
        score: results.score,
      };
    });
  }

  static calculateConfidence(filterScores) {
    let totalWeight = 0;
    let weightedScore = 0;

    filterScores.forEach((({ score, weight }) => {
      totalWeight += weight;
      weightedScore += (score * weight);
    }))

    return (weightedScore / totalWeight);
  }

  static findKeys(line, minScore) {
    const terms = SecretsFilter.preFilter(line).split(/ +/);
    return terms.map((term) => {
      const filterScores = SecretsFilter.scoreTerm(term, Filters);
      const confidence = SecretsFilter.calculateConfidence(filterScores);

      if (confidence < minScore) {
        return null;
      }

      return {
        term,
        filterScores,
        confidence,
      };
    })
      .filter(key => (key !== null));
  }
};

module.exports = SecretsFilter;
