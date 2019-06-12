const name = 'Length';
const weight = 2;
const negativeWeight = 1;

function checkMatch(term) {
  if (term.length >= 32) {
    return 1;
  }

  if (term.length >= 24) {
    return 5;
  }

  if (term.length >= 15) {
    return .7;
  }

  return 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
