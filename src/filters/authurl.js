const name = 'Auth URL';
const weight = 100;
const negativeWeight = 0;

function checkMatch(term) {
  return (term.includes('://') && term.includes('@')) ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
