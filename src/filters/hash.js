const Filter = require('../objects/Filter');

const name = 'Cryptographic Hash';

const hashRegex = /^(md5|sha(1|[0-9]{3}))(-|:)/;

class CustomFilter extends Filter {
  checkMatch(term) {
    return hashRegex.test(term);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
