const Filter = require('../objects/Filter');

const basicIPV6Regex = /([a-f0-9]{4}:){7}([a-f0-9]{4})/;

class IPAddress extends Filter {
  constructor() {
    super('IP Address');
  }

  checkMatch(term) {
    return basicIPV6Regex.test(term);
  }
}

const filter = new IPAddress();
module.exports = filter;
