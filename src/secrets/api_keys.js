const Secret = require('../Secret');
const CryptoKeyExtentions = require('../crypto_key_extensions');
const CryptoKeysSecret = require('./crypto_keys');

const name = 'API Key';
const preFilters = ['dictionary', 'email', 'mimetypes', 'awsresource', 'ipaddress', 'uuid', 'regex', 'repeating_characters', 'enumerated-charset', 'path', 'url', 'package_version', 'hash'];
const filters = ['mixedchars', 'entropy'];

const charactersToReplace = /("|'|;|\(\)|{}|(->))+/g;
const variableNameRegex = (/^([a-zA-Z0-9]{2,}_)+([a-zA-Z0-9]){2,}(=|:)/);

class APIKeys extends Secret {
  constructor() {
    const excludedExtensions = [...CryptoKeyExtentions.private_keys, ...CryptoKeyExtentions.public_keys];
    super(name, { preFilters, filters, excludedExtensions });

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
      .replace(charactersToReplace, ' ')
      .replace(variableNameRegex, ' ')
      .trim()
      .split(/ +/)
      .filter(term => (term.length >= this.minTermLength) && (term.length <= this.maxTermLength));
  }
}

const apiKeys = new APIKeys();
module.exports = apiKeys;
