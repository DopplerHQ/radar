const FileTags = require('../objects/file_tags');
const Secret = require('../Secret');
const TimeZones = require('../dictionaries/timezones');
const Countries = require('../dictionaries/countries');

class APIKeys extends Secret {
  constructor() {
    const name = 'api_key';
    const preFilters = [
      'base64',
      'uri_encoding',
      'hex_notation',
      'xml',
      'common_patterns',
      'date',
      'mimetypes',
      'awsresource',
      'ipaddress',
      'uuid',
      'repeating_characters',
      'enumerated_charset',
      'filename',
      'path',
      'url',
      'email', // place this after url filter
      'package_version',
      'hash',
      'regex',
      'dictionary',
    ];
    const filters = ['entropy'];
    const excludedFileTags = [FileTags.CRYPTO_PRIVATE_KEY, FileTags.CRYPTO_PUBLIC_KEY, FileTags.ENV_FILE, FileTags.NO_EXTENSION];
    super(name, { preFilters, filters, excludedFileTags });

    this.charactersToReplace = /(\||"|'|;|\\|\(\)|{}|(->))+/g;
    this.variableNameRegex = (/^([a-zA-Z0-9]{2,}_)+([a-zA-Z0-9]){2,}(=|:)/);
    this.lettersRegex = /[a-z]/ig;
    this.groupsOfNumbersRegex = /[0-9]+/ig;
    this.numbersRegex = /[0-9]/g;

    this.minAlphaNumericTermLength = 24;
    this.minTermLength = 36;
    this.maxTermLength = 256;
    this.maxLineLength = 512;

    // exclude reserved terms that can appear without being separated by a space
    this.excludedTerms = ['regexp', 'shasum', 'http://', 'https://', 'file://', 'hdfs:/', 'data:', 'gitHead', 'function', 'example', 'return', 'assert', "utf-8", "struct<", "<T>", "tarsum"];
    TimeZones.forEach(tz => this.excludedTerms.push(tz));
    Countries.forEach(country => this.excludedTerms.push(country));
  }

  shouldScan(tags) {
    // always allow readmes, even if they don't have an extension
    if (tags.has(FileTags.README)) {
      return true;
    }

    return super.shouldScan(tags);
  }

  getTerms(line) {
    const lineLowerCase = line.toLowerCase();
    if (APIKeys.isLineContainsExclusions(lineLowerCase, this.excludedTerms)
        || !APIKeys.isLineLengthValid(line, this.maxLineLength)) {
      return [];
    }

    return line.split('')
      .map(char => APIKeys.isCharacterValid(char) ? char : ' ')
      .join('')
      .replace(this.charactersToReplace, ' ')
      .replace(this.variableNameRegex, ' ')
      .trim()
      .split(/ +/)
      .filter(term => this.isTermLengthValid(term))
      .filter(term => this.isAlphaNumeric(term));
  }

  isAlphaNumeric(term) {
    const containsLetters = term.match(this.lettersRegex);
    // require 3 or more unique letters to help reduce false positives
    if ((containsLetters === null) || (new Set(containsLetters).size < 3)) {
      return false;
    }

    const groupsOfNumbers = term.match(this.groupsOfNumbersRegex);
    // require 3 or more groups of numbers
    if ((groupsOfNumbers === null) || (groupsOfNumbers.length < 3)) {
      return false;
    }

    const containsNumbers = term.match(this.numbersRegex);
    // require 3 or more distinct numbers to help reduce false positives
    if ((containsNumbers === null) || (new Set(containsNumbers).size < 3)) {
      return false;
    }

    return true;
  }

  static isCharacterValid(char) {
    // allow ASCII special characters and alphanumerics
    return (char.charCodeAt(0) >= 33) && (char.charCodeAt(0) <= 126);
  }

  static isLineContainsExclusions(line, excludedTerms) {
    return excludedTerms.some(term => line.includes(term));
  }

  static isLineLengthValid(line, maxLength) {
    return line.length <= maxLength;
  }

  isTermLengthValid(term) {
    if (term.length > this.maxTermLength) {
      return false;
    }

    if (term.length >= this.minTermLength) {
      return true;
    }

    const alphaNumericTerms = term.match(/[a-z0-9]+/ig);
    if (alphaNumericTerms === null) {
      return false;
    }

    const termsOfValidLength = alphaNumericTerms.filter(t => (t.length >= this.minAlphaNumericTermLength) && (t.length % 4 === 0));
    return termsOfValidLength.length > 0;
  }
}

const apiKeys = new APIKeys();
module.exports = apiKeys;
