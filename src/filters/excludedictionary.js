const dictionary = new Set(require('an-array-of-english-words'));

const customDictionary = require('../customdictionary');
const filetypes = require('../filetypes');
const FilterWeights = require('../objects/filterweights');

const name = 'Exclude dictionary words';
const weight = FilterWeights.NONE;
const negativeWeight = FilterWeights.MAX;

const minimumMatchPercentage = 0.35;
const minimumWordLength = 3;
const customDictionaryMap = {};

customDictionary.forEach((word) => {
  if (word.length >= minimumWordLength) {
    customDictionaryMap[word.toLowerCase()] = true;
  }
});
Object.keys(filetypes).forEach((type) => {
  filetypes[type].forEach((filetype) => {
    if ((filetype.length >= minimumWordLength) && ((/^[a-zA-Z0-9]+$/g).test(filetype))) {
      customDictionaryMap[filetype.toLowerCase()] = true;
    }
  });
});

function checkMatch(term) {
  const percentMatches = checkDictionary(term);
  // we want to exclude matches, so treat a match as a negative case
  return (percentMatches >= minimumMatchPercentage) ? 0 : 1;
}

function splitIntoTerms(term) {
  return term
    // allow letters, numbers, and hyphens
    .replace(/[^a-zA-Z0-9-]+/gi, ' ')
    // separate camelCase terms
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+?)([A-Z][a-z])/g, '$1 $2')
    .trim()
    .toLowerCase()
    .split(/ +/)
    // allow alphanumeric string or string w/ at most one hyphen located betweem other alphanumerics
    .filter(t => (/^[a-z0-9]+$/g).test(t) || (/^[a-z]+(-)?[a-z]+$/g).test(t));
}

function getUniqueTerms(terms) {
  const termsSet = new Set(terms);
  return Array.from(termsSet);
}

function checkDictionary(term) {
  const terms = splitIntoTerms(term);
  const uniqueTerms = getUniqueTerms(terms);

  const matches = uniqueTerms.reduce((acc, word) => {
    const isDictionaryWord = ((word.length >= minimumWordLength) && (dictionary.has(word) || customDictionaryMap[word]));
    return isDictionaryWord ? (acc + 1) : acc;
  }, 0);

  const percentMatches = (matches / uniqueTerms.length);
  return percentMatches;
}

module.exports = { name, weight, negativeWeight, checkMatch };
