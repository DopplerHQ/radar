const name = 'String';
const weight = 1;
const negativeWeight = 0;

function checkMatch(term) {
  const isString = ((term.startsWith('\'') && term.endsWith('\''))
    || (term.startsWith('"') && term.endsWith('"'))
    || (term.startsWith('`') && term.endsWith('`')));

  return isString ? 1 : 0;
}

module.exports = { name, weight, negativeWeight, checkMatch };
