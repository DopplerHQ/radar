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

function isValidCharacter(char) {
  return validCharactersRegex.test(char);
}

function preFilter(text) {
  return text.split('').map(char => (isValidCharacter(char) ? char : ' ')).join('');
}

/**
 * Calculate a term's score against each each filter
 * @param {String} term
 * @param {Array<Filters} filters
 * @returns Array of objects representing each filter's score
 */
function scoreTerm(term, filters) {
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

function calculateConfidence(filterScores) {
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

module.exports.findKeys = (line, minScore) => {
  const keys = [];
  const terms = preFilter(line).split(/ +/);
  terms.forEach((term) => {
    const filterScores = scoreTerm(term, Filters);
    const confidence = calculateConfidence(filterScores);

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
