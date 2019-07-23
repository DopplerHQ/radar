const Secret = require('../Secret');
const FileTags = require('../objects/file_tags');

class CryptoKeys extends Secret {
  constructor() {
    const name = 'crypto_key';
    const filters = ['crypto_keys'];
    const fileTags = [FileTags.CRYPTO_PRIVATE_KEY, FileTags.NO_EXTENSION];

    super(name, { filters, fileTags });
  }

  check(terms) {
    const { secrets } = super.check(terms);
    const foundKey = (secrets.length > 0);
    if (foundKey && terms[0].includes("END ")) {
      return {
        secrets: [],
        tags: {
          [FileTags.CRYPTO_PRIVATE_KEY]: false,
        }
      };
    }

    const tags = {};
    if (foundKey) {
      tags[FileTags.CRYPTO_PRIVATE_KEY] = true;
    };

    return {
      secrets,
      tags,
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
