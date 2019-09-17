const Secret = require('../Secret');
const FileTags = require('../objects/file_tags');

class CryptoKeys extends Secret {
  constructor() {
    const name = 'crypto_key';
    const filters = ['private_keys', 'public_keys'];

    super(name, { filters });
  }

  check(terms) {
    const { secrets } = super.check(terms);
    if (secrets.length === 0) {
      return {
        secrets,
        tags: {},
        metadata: {},
      };
    }

    const term = terms[0];
    const isBeginBlock = term.includes("BEGIN ");
    const isPrivateKey = term.includes("PRIVATE KEY");
    const tag = isPrivateKey ? FileTags.CRYPTO_PRIVATE_KEY : FileTags.CRYPTO_PUBLIC_KEY;

    return {
      secrets: (isPrivateKey && isBeginBlock) ? secrets : [],
      tags: {
        [tag]: isBeginBlock,
      },
      metadata: {},
    };
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
