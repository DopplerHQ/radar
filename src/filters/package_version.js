const Filter = require('../objects/Filter');

const name = 'Auth URL';

const versionRegex = /@\^?[0-9]+\.[0-9]\.[0-9]/;

class CustomFilter extends Filter {
  checkMatch(term) {
    return versionRegex.test(term);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
