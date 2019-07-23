const Classifier = require('../objects/classifier');
const FileTags = require('../objects/file_tags');
const { private_keys } = require('../crypto_key_extensions');

class PrivateKey extends Classifier {
  constructor() {
    const tag = FileTags.CRYPTO_PRIVATE_KEY;
    const extensions = [...private_keys];

    super(tag, extensions);
  }
}

const privateKey = new PrivateKey();
module.exports = privateKey;
