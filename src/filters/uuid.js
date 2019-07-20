const Filter = require('../objects/Filter');

const uuidRegex = /[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}/;

class UUID extends Filter {
  constructor() {
    super('UUID');
  }

  checkMatch(term) {
    return uuidRegex.test(term);
  }
}

const filter = new UUID();
module.exports = filter;
