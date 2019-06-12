const name = 'Exclude file paths';
const weight = 1;
const negativeWeight = 100;

function matchScore(term) {
  const hasPathNavigation = (term.includes('../') || term.includes('./'));
  const hasMultiplePathSeparators = (!term.includes('://') && ((term.match(/\//g) || []).length >= 2));
  // we want to exclude paths, so treat a match as a negative case
  return (hasPathNavigation || hasMultiplePathSeparators) ? 0 : 1;
}

module.exports = { name, weight, negativeWeight, matchScore };
