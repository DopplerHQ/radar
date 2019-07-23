const FileTags = require('../objects/file_tags');
const Secret = require('../Secret');
const CryptoKeyExtentions = require('../crypto_key_extensions');

class APIKeys extends Secret {
  constructor() {
    const name = 'api_key';
    const preFilters = ['dictionary', 'email', 'date', 'mimetypes', 'awsresource', 'ipaddress', 'uuid', 'regex', 'repeating_characters', 'enumerated-charset', 'path', 'url', 'package_version', 'hash'];
    const filters = ['mixedchars', 'entropy'];
    const excludedExtensions = [...CryptoKeyExtentions.private_keys, ...CryptoKeyExtentions.public_keys];
    const excludedFileTags = [FileTags.CRYPTO_FILE];
    const shouldCacheShouldScan = false;
    super(name, { preFilters, filters, excludedExtensions, excludedFileTags, shouldCacheShouldScan });

    this.charactersToReplace = /("|'|;|\(\)|{}|(->))+/g;
    this.variableNameRegex = (/^([a-zA-Z0-9]{2,}_)+([a-zA-Z0-9]){2,}(=|:)/);

    this.minTermLength = 20;
    this.maxTermLength = 1000;
  }

  getTerms(line) {
    const excludedTerms = ['regexp', 'shasum', 'http://', 'https://', 'data:image/png;base64', 'gitHead'];
    const lineContainsExclusion = excludedTerms.reduce((acc, val) => (
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

  shouldScan(scannedFile) {
    if (scannedFile.tags().has(FileTags.CRYPTO_FILE)) {
      return {
        shouldScan: false,
        cache: false,
      };
    }

    return Object.assign({}, super.shouldScan(scannedFile), { shouldCache: false });
  };
}

const apiKeys = new APIKeys();
module.exports = apiKeys;
