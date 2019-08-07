const FileTags = require('../objects/file_tags');
const Secret = require('../Secret');

class KnownAPIKeys extends Secret {
  constructor() {
    const name = 'known_api_key';
    const filters = ['known_api_keys'];
    super(name, { filters });
  }
}

const knownAPIKeys = new KnownAPIKeys();
module.exports = knownAPIKeys;
