const fs = require('fs');
const path = require('path');

// a-z A-Z 0-9 . @ + = - _ : / \
const validCharactersRegex = (/[a-zA-Z0-9\.@+=-_:\/\\]/);

const filtersPath = path.resolve(__dirname, 'filters')
const filters = [];
// NOTE this will execute synchronously on this file's initial load
fs.readdirSync(filtersPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const filter = require(filtersPath + '/' + file);
    filters.push(filter);
  }
});

function isValidCharacter(char) {
  return validCharactersRegex.test(char);
}

function preFilter(text) {
  return text.split('').map(char => (isValidCharacter(char) ? char : ' ')).join('');
}

async function findKeys(text, ) {
  const filteredText = preFilter(text);
  const keys = [];
  for (const term of filteredText.split(/ +/)) {
    let totalWeight = 0;
    let weightedScore = 0;
    filters.forEach((filter) => {
      const { name, weight, negativeWeight } = filter;
      const score = filter.checkMatch(term);

      if (score === 0) {
        totalWeight += negativeWeight;
        weightedScore += (negativeWeight * score);
      }
      else {
        totalWeight += weight;
        weightedScore += (weight * score);
      }
    });

    const avgScore = (weightedScore / totalWeight);
    if (avgScore >= .7) {
      keys.push({
        term,
        confidence: avgScore,
      });
    }
  }
  return keys;
}

module.exports = { findKeys }
