const fs = require('fs');
const path = require('path');

const qualifiersPath = path.resolve(__dirname, 'qualifiers')
const qualifiers = [];
fs.readdirSync(qualifiersPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const qualifier = require(qualifiersPath + '/' + file);
    qualifiers.push(qualifier);
  }
});

async function findKeys(text) {
  const keys = [];
  for (const term of text.split(' ')) {
    let totalWeight = 0;
    let weightedScore = 0;
    qualifiers.forEach((qualifier) => {
      const { name, weight, negativeWeight } = qualifier;
      const score = qualifier.matchScore(term);

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
