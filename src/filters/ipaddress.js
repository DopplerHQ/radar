const Filter = require('../objects/Filter');

const name = 'IP Address';

const basicIPV6Regex = /([a-f0-9]{4}:){7}([a-f0-9]{4})/;

class CustomFilter extends Filter {
  checkMatch(term) {
    return basicIPV6Regex.test(term);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
