const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');
const { public_keys } = require('../crypto_key_extensions');

class PublicKey extends Classifier {
  constructor() {
    const tag = FileTags.CRYPTO_PUBLIC_KEY;
    const extensions = [...public_keys];

    super(tag, extensions);
  }
}

const publicKey = new PublicKey();
module.exports = publicKey;