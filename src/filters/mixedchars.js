const name = 'Mixed alphanumeric characters';
const weight = 2;
const negativeWeight = 2;

function checkMatch(term) {
  const containsLetters = term.match(/[a-zA-Z]/i);
  const containsNumbers = term.match(/[0-9]/i);

  return (containsLetters && containsNumbers) ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
