const Filter = require('../objects/Filter');

const urlRegex = /([a-zA-Z]+):\/\/.+/;

class URL extends Filter {
  constructor() {
    super('URL');
  }

  checkMatch(term) {
    return urlRegex.test(term);
  }
}

const filter = new URL();
module.exports = filter;
