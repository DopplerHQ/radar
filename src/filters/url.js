const Filter = require('../objects/Filter');

const name = 'URL';

const urlRegex = /([a-zA-Z]+):\/\/.+/;

class CustomFilter extends Filter {
  checkMatch(term) {
    return urlRegex.test(term);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
