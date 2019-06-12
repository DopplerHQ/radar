const dictionary = new Set(require('an-array-of-english-words'));

const name = 'Exclude dictionary words';
const weight = 1;
const negativeWeight = 100;

const minimumMatchPercentage = 0.35;

function checkMatch(term) {
  const percentMatches = checkDictionary(term);
  // we want to exclude matches, so treat a match as a negative case
  return (percentMatches >= minimumMatchPercentage) ? 0 : 1;
}

// from https://github.com/auth0/repo-supervisor/blob/master/src/filters/entropy.meter/pre.filters/dictionary.words.js
function splitIntoTerms(term) {
  let modifiedTerm = term;

  // remove hyphens, underscores, quotes, at symbol, parentheses, brackets, braces, (semi) colons, commas, periods, question marks, exclamation points, and slashes
  modifiedTerm = modifiedTerm.replace(/[-_'"@\(\)\[\]<>{};:,\.\?!\/\\]/g, ' ');
  // remove numbers
  modifiedTerm = modifiedTerm.replace(/([0-9]+)/g, ' ');

  // separate camelCase terms
  modifiedTerm = modifiedTerm.replace(/([A-Z]+?)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  // split into individual terms
  return modifiedTerm.trim().split(/ +/);
}

function getUniqueTerms(terms) {
  const termsSet = new Set(terms);
  return Array.from(termsSet);
}

function checkDictionary(term) {
  const terms = splitIntoTerms(term);
  const uniqueTerms = getUniqueTerms(terms);

  const matches = uniqueTerms.reduce((acc, word) => (
    acc + ((word.length > 2) && dictionary.has(word))
  ), 0);

  const percentMatches = (matches / uniqueTerms.length);
  return percentMatches;
}

module.exports = { name, weight, negativeWeight, checkMatch };
