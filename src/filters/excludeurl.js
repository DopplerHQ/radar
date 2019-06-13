const name = 'URL';
const weight = 0;
const negativeWeight = 100;

function checkMatch(term) {
  const isURL = term.includes('://') && (!term.includes('@'));
  return isURL ? 0 : 1;
}

module.exports = { name, weight, negativeWeight, checkMatch };
