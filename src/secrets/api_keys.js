const FileTags = require('../objects/file_tags');
const Secret = require('../Secret');
const TimeZones = require('../dictionaries/timezones');
const Countries = require('../dictionaries/countries');

class APIKeys extends Secret {
  constructor() {
    const name = 'api_key';
    const preFilters = ['dictionary', 'common_patterns', 'email', 'date', 'mimetypes', 'awsresource', 'ipaddress', 'uuid', 'regex', 'repeating_characters', 'enumerated-charset', 'path', 'url', 'package_version', 'hash'];
    const filters = ['mixedchars', 'entropy'];
    const excludedFileTags = [FileTags.CRYPTO_PRIVATE_KEY, FileTags.CRYPTO_PUBLIC_KEY, FileTags.ENV_FILE];
    super(name, { preFilters, filters, excludedFileTags });

    this.charactersToReplace = /("|'|;|\\|\(\)|{}|(->))+/g;
    this.variableNameRegex = (/^([a-zA-Z0-9]{2,}_)+([a-zA-Z0-9]){2,}(=|:)/);

    this.minTermLength = 20;
    this.maxTermLength = 1000;

    this.excludedTerms = ['regexp', 'shasum', 'http://', 'https://', 'data:image/png;base64', 'gitHead', 'function'];
    TimeZones.forEach(tz => this.excludedTerms.push(tz));
    Countries.forEach(country => this.excludedTerms.push(country));
  }

  getTerms(line) {
    const lineContainsExclusion = this.excludedTerms.reduce((acc, val) => (
      acc || line.includes(val)
    ), false);
    if (lineContainsExclusion)
      return [];

    return line.split('')
      .map(char => ((char.charCodeAt(0) >= 33) && (char.charCodeAt(0) <= 126)) ? char : " ")
      .join('')
      .replace(this.charactersToReplace, ' ')
      .replace(this.variableNameRegex, ' ')
      .trim()
      .split(/ +/)
      .filter(term => (term.length >= this.minTermLength) && (term.length <= this.maxTermLength));
  }
}

const apiKeys = new APIKeys();
module.exports = apiKeys;
