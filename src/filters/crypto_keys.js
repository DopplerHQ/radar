const Filter = require('../objects/Filter');

const name = 'Identify cryptographic keys';

const PrivateKeyRegex = (/^.*(BEGIN ).*(PRIVATE KEY).*$/i);

class CustomFilter extends Filter {
  checkMatch(term) {
    return PrivateKeyRegex.test(term);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
