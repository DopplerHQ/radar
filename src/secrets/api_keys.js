const FileTags = require('../objects/file_tags');
const Secret = require('../Secret');
const TimeZones = require('../dictionaries/timezones');
const Countries = require('../dictionaries/countries');

class APIKeys extends Secret {
  constructor() {
    const name = 'api_key';
    const preFilters = [
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
    const lineContainsExclusion = this.excludedTerms.reduce((acc, val) => (
      acc || lineLowerCase.includes(val)
    ), false);
    if (lineContainsExclusion) {
      return [];
    }

    if (!this.isValidLineLength(line)) {
      return [];
    }

    return line.split('')
      .map(char => APIKeys.isValidCharacter(char) ? char : ' ')
      .join('')
      .replace(this.charactersToReplace, ' ')
      .replace(this.variableNameRegex, ' ')
      .trim()
      .split(/ +/)
      .filter(term => this.isValidTermLength(term))
      .filter(term => !term.endsWith('.com'))
      .filter((term) => {
        const containsLetters = term.match(this.lettersRegex);
        // require 2 or more letters numbers to help reduce false positives
        if ((containsLetters === null) || (new Set(containsLetters).size < 2)) {
          return false;
        }

        const containsNumbers = term.match(this.numbersRegex);
        // require 2 or more distinct numbers to help reduce false positives
        if ((containsNumbers === null) || (new Set(containsNumbers).size < 2)) {
          return false;
        }

        return true;
      });
  }

  static isValidCharacter(char) {
    return (char.charCodeAt(0) >= 33) && (char.charCodeAt(0) <= 126);
  }

  isValidLineLength(line) {
    return line.length <= this.maxLineLength;
  }

  isValidTermLength(term) {
    if (term.length > this.maxTermLength) {
      return false;
    }

    const isAlphaNumeric = /^[a-z0-9]+$/i.test(term);
    return (term.length >= this.minTermLength)
      || (isAlphaNumeric && (term.length >= this.minAlphaNumericTermLength) && (term.length % 4 === 0));
  }
}

const apiKeys = new APIKeys();
module.exports = apiKeys;
