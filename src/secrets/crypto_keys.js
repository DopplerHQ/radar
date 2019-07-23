const Secret = require('../Secret');
const CryptoKeyExtentions = require('../crypto_key_extensions');
const FileTags = require('../objects/file_tags');

const name = 'crypto_key';
const filters = ['crypto_keys'];
// include files w/ no extension so we can support typical openssh key names (e.g. id_ed25519)
const noExtension = '';
const extensions = [noExtension, ...CryptoKeyExtentions.private_keys];

class CryptoKeys extends Secret {
  constructor() {
    super(name, { filters, extensions });
  }

  check(terms, scannedFile) {
    const results = super.check(terms);
    const foundKey = (results.length > 0);
    if (foundKey && terms[0].includes("END ")) {
        scannedFile.tags().delete(FileTags.CRYPTO_FILE);
        return [];
      }

    if (foundKey) {
      scannedFile.tags().add(FileTags.CRYPTO_FILE);
    }

    return results;
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
