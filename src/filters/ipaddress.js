const Filter = require('../objects/Filter');

class IPAddress extends Filter {
  constructor() {
    super('IP Address');

    // support 8 groups with 1-4 hex characters per group
    this.basicIPV6Regex = /([a-f0-9]{1,4}:){7}([a-f0-9]{1,4})/i;
  }

  isMatch(term) {
    return this.basicIPV6Regex.test(term);
  }
}

const filter = new IPAddress();
module.exports = filter;
