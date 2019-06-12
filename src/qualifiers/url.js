const name = 'URL';
const weight = 2;
const negativeWeight = 0;

function matchScore(term) {
  return term.includes('://') ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, matchScore };
