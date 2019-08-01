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
    const excludedFileTags = [FileTags.CRYPTO_PRIVATE_KEY, FileTags.CRYPTO_PUBLIC_KEY, FileTags.ENV_FILE, FileTags.GOLANG];
    super(name, { preFilters, filters, excludedFileTags });

    this.charactersToReplace = /(\||"|'|;|\\|\(\)|{}|(->))+/g;
    this.variableNameRegex = (/^([a-zA-Z0-9]{2,}_)+([a-zA-Z0-9]){2,}(=|:)/);
    this.lettersRegex = /[a-z]/i;
    this.numbersRegex = /[0-9]/;

    this.minAlphaNumericTermLength = 24;
    this.minTermLength = 36;
    this.maxTermLength = 256;
    this.maxLineLength = 512;

    this.excludedTerms = ['regexp', 'shasum', 'http://', 'https://', 'file://', 'data:', 'gitHead', 'function', 'example'];
    TimeZones.forEach(tz => this.excludedTerms.push(tz));
    Countries.forEach(country => this.excludedTerms.push(country));
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
        if (containsLetters === null) {
          return false;
        }

        const containsNumbers = term.match(this.numbersRegex);
        if (containsNumbers === null) {
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
