const dictionary = new Set(require('an-array-of-english-words'));

const customDictionary = require('../dictionaries/custom');
const ExcludedFiletypes = require('../../config/excluded_filetypes');
const IncludedFiletypes = require('../../config/included_filetypes');
const Filter = require('../objects/Filter');

class Dictionary extends Filter {
  constructor() {
    super('Dictionary words');

    this.minimumMatchPercentage = 0.35;
    this.minimumWordLength = 3;
    this.customDictionaryMap = {};

    this.alphaNumericRegex = /^[a-z0-9]+$/ig;
    this.lettersRegex = /[a-z]/ig;

    customDictionary.forEach((word) => {
      if (word.length >= this.minimumWordLength) {
        this.customDictionaryMap[word.toLowerCase()] = true;
      }
    });

    // NOTE we want to explicitly remove the leading period here
    Object.keys(ExcludedFiletypes).forEach((type) => {
      ExcludedFiletypes[type].forEach((fileExt) => {
        if (fileExt.startsWith("*.")) {
          fileExt = fileExt.substring(2);
        }
        else if (fileExt.startsWith("(|*).")) {
          fileExt = fileExt.substring(5);
        }
        else if (fileExt.startsWith('.')) {
          fileExt = fileExt.substring(1);
        }

        if ((fileExt.length >= this.minimumWordLength) && (this.alphaNumericRegex.test(fileExt))) {
          this.customDictionaryMap[fileExt.toLowerCase()] = true;
        }
      });
    });
    Object.keys(IncludedFiletypes).forEach((type) => {
      IncludedFiletypes[type].forEach((fileExt) => {
        if (fileExt.startsWith("*.")) {
          fileExt = fileExt.substring(2);
        }
        else if (fileExt.startsWith("(|*).")) {
          fileExt = fileExt.substring(5);
        }
        else if (fileExt.startsWith('.')) {
          fileExt = fileExt.substring(1);
        }

        if ((fileExt.length >= this.minimumWordLength) && (this.alphaNumericRegex.test(fileExt))) {
          this.customDictionaryMap[fileExt.toLowerCase()] = true;
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
    if (terms.length === 0)
      return 0;

    const uniqueTerms = this._getUniqueTerms(terms);
    let uniqueWords = 0;

    const matches = uniqueTerms.filter((word) => {
      const isNumber = (word.match(this.lettersRegex) === null);
      const foundInDictionary = dictionary.has(word) || (this.customDictionaryMap[word] === true);
      if (!isNumber || foundInDictionary) {
        ++uniqueWords;
      }
      return foundInDictionary;
    });

    const matchPercentage = (matches.length / uniqueWords);
    return matchPercentage;
  }
}

const filter = new Dictionary();
module.exports = filter;
