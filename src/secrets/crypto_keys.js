const Secret = require('../Secret');
const CryptoKeyExtentions = require('../crypto_key_extensions');

const name = 'Cryptographic key';
const preFilters = [];
const filters = ['crypto_keys'];

class CryptoKeys extends Secret {
  constructor() {
    // include files w/ no extension so we can support typical openssh key names (e.g. id_ed25519)
    const extensions = [...CryptoKeyExtentions.private_keys, ''];
    super(name, preFilters, filters, extensions);
  }

  /**
   *
   * @param {Array<String>} line
   */
  getTerms(line) {
    return [line];
  }
}

const cryptoKeys = new CryptoKeys();
module.exports = cryptoKeys;
