const Secret = require('../Secret');

const name = 'Cryptographic key';
const preFilters = [];
const filters = ['crypto_keys'];
// include files w/ no extension so we can support typical openssh key names (e.g. id_ed25519)
const extensions = ['', 'asc', 'ca-bundle', 'der', 'gpg', 'key', 'opk', 'ospk', 'p10', 'p12', 'p7', 'p7a', 'p7b', 'p7c', 'p7s', 'pem', 'pfx', 'pgp', 'pk', 'pkcs', 'pkcs12', 'ppk', 'spc'];

class CryptoKeys extends Secret {
  constructor() {
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
