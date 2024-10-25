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

    const buildCustomDictionary = (fileTypes) => {
      Object.keys(fileTypes).forEach((type) => {
        fileTypes[type].forEach((fileExt) => {
          // *.js -> js
          if (fileExt.startsWith("*.")) {
            fileExt = fileExt.substring(2);
          }
          // .js -> js
          else if (fileExt.startsWith('.')) {
            fileExt = fileExt.substring(1);
          }

          // js.* -> js
          if (fileExt.endsWith(".*")) {
            fileExt = fileExt.substring(0, fileExt.length - 2)
          }

          if ((fileExt.length >= this.minimumWordLength) && (this.alphaNumericRegex.test(fileExt))) {
            this.customDictionaryMap[fileExt.toLowerCase()] = true;
          }
        });
      });
    };

    buildCustomDictionary(ExcludedFiletypes);
    buildCustomDictionary(IncludedFiletypes);
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
