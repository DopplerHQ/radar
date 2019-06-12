const name = 'Email';
const weight = 2;
const negativeWeight = 0;

function checkMatch(term) {
  // the simplest email regex will suffice
  const emailRegex = (/^\S+@\S+\.\S+$/);
  return emailRegex.test(term) ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
