const FileTags = require('../objects/file_tags');
const Secret = require('../Secret');
const TimeZones = require('../dictionaries/timezones');
const Countries = require('../dictionaries/countries');

class APIKeys extends Secret {
  constructor() {
    const name = 'api_key';
    // pre-filters and filters will be tested in the order they're specified
    const preFilters = [
      'dictionary',
      'common_patterns',
      'xml',
      'email',
      'date',
      'mimetypes',
      'awsresource',
      'ipaddress',
      'uuid',
      'regex',
      'repeating_characters',
      'enumerated-charset',
      'path',
      'url',
      'package_version',
      'hash',
    ];
    const filters = ['mixedchars', 'entropy'];
    const excludedFileTags = [FileTags.CRYPTO_PRIVATE_KEY, FileTags.CRYPTO_PUBLIC_KEY, FileTags.ENV_FILE];
    super(name, { preFilters, filters, excludedFileTags });

    this.charactersToReplace = /("|'|;|\\|\(\)|{}|(->))+/g;
    this.variableNameRegex = (/^([a-zA-Z0-9]{2,}_)+([a-zA-Z0-9]){2,}(=|:)/);

    this.minAlphaNumericTermLength = 24;
    this.minTermLength = 36;
    this.maxTermLength = 1000;

    this.excludedTerms = ['regexp', 'shasum', 'http://', 'https://', 'data:image/png;base64', 'gitHead', 'function', 'example'];
    TimeZones.forEach(tz => this.excludedTerms.push(tz));
    Countries.forEach(country => this.excludedTerms.push(country));
  }

  getTerms(line) {
    const lineLowerCase = line.toLowerCase();
    const lineContainsExclusion = this.excludedTerms.reduce((acc, val) => (
      acc || lineLowerCase.includes(val)
    ), false);
    if (lineContainsExclusion)
      return [];

    return line.split('')
      .map(char => APIKeys.isValidCharacter(char) ? char : ' ')
      .join('')
      .replace(this.charactersToReplace, ' ')
      .replace(this.variableNameRegex, ' ')
      .trim()
      .split(/ +/)
      .filter(term => this.isValidLineLength(term))
      .filter(term => !term.endsWith('.com'));
  }

  static isValidCharacter(char) {
    return (char.charCodeAt(0) >= 33) && (char.charCodeAt(0) <= 126);
  }

  isValidLineLength(term) {
    return (term.length >= this.minTermLength) && (term.length <= this.maxTermLength);
  }

  isValidLineLength(term) {
    if (term.length > this.maxTermLength)
      return false;

    const isAlphaNumeric = /^[a-z0-9]+$/i.test(term);
    return (term.length >= this.minTermLength)
      || (isAlphaNumeric && (term.length >= this.minAlphaNumericTermLength) && (term.length % 4 === 0));
  }
}

const apiKeys = new APIKeys();
module.exports = apiKeys;
