const Secret = require('../Secret');
const CryptoKeyExtentions = require('../crypto_key_extensions');
const FileTags = require('../objects/file_tags');

class CryptoKeys extends Secret {
  constructor() {
    const name = 'crypto_key';
    const filters = ['crypto_keys'];
    // include files w/ no extension so we can support typical openssh key names (e.g. id_ed25519)
    const noExtension = '';
    const extensions = [noExtension, ...CryptoKeyExtentions.private_keys];

    super(name, { filters, extensions });
  }

  check(terms) {
    const { secrets } = super.check(terms);
    const foundKey = (secrets.length > 0);
    if (foundKey && terms[0].includes("END ")) {
        return {
          secrets: [],
          tags: {
            [FileTags.CRYPTO_FILE]: false,
          }
        };
      }

    return {
      secrets,
      tags: {
        [FileTags.CRYPTO_FILE]: (foundKey ? true : null),
      },
    }
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
