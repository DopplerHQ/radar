const dictionary = new Set(require('an-array-of-english-words'));

const customDictionary = require('../dictionaries/custom');
const filetypes = require('../filetypes');
const Filter = require('../objects/Filter');

class Dictionary extends Filter {
  constructor() {
    super('Dictionary words');

    this.minimumMatchPercentage = 0.35;
    this.minimumWordLength = 3;
    this.customDictionaryMap = {};

    customDictionary.forEach((word) => {
      if (word.length >= this.minimumWordLength) {
        this.customDictionaryMap[word.toLowerCase()] = true;
      }
    });
    countryDictionary.forEach((word) => {
      if (word.length >= this.minimumWordLength) {
        this.customDictionaryMap[word.toLowerCase()] = true;
      }
    });
    Object.keys(filetypes).forEach((type) => {
      filetypes[type].forEach((filetype) => {
        if ((filetype.length >= this.minimumWordLength) && ((/^[a-zA-Z0-9]+$/g).test(filetype))) {
          this.customDictionaryMap[filetype.toLowerCase()] = true;
        }
      });
    });
  }

  isMatch(term) {
    const percentMatches = this._checkDictionary(term);
    return percentMatches >= this.minimumMatchPercentage;
  }

  _splitIntoTerms(term) {
    return term
      // allow letters and numbers
      .replace(/[^a-zA-Z0-9]+/gi, ' ')
      // separate camelCase terms
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+?)([A-Z][a-z])/g, '$1 $2')
      // separate capital letters following lowercase letters and numbers
      .replace(/([a-z]+[0-9]+)([A-Z])/g, '$1 $2')
      .toLowerCase()
      .trim()
      .split(/ +/)
      .filter(t => (t.length >= this.minimumWordLength));
  }

  _getUniqueTerms(terms) {
    const termsSet = new Set(terms);
    return Array.from(termsSet);
  }

  _checkDictionary(term) {
    const terms = this._splitIntoTerms(term);
    const uniqueTerms = this._getUniqueTerms(terms);

    const matches = uniqueTerms.reduce((acc, word) => {
      const isDictionaryWord = (dictionary.has(word) || (this.customDictionaryMap[word] === true));
      return acc + (isDictionaryWord ? 1 : 0);
    }, 0);

    const matchPercentage = (matches / uniqueTerms.length);
    return matchPercentage;
  }
}

const filter = new Dictionary();
module.exports = filter;
