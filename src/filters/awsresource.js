const Filter = require('../objects/Filter');

const name = 'Amazon AWS resource';

class AWSResource extends Filter {
  checkMatch(term) {
    return term.startsWith('arn:aws:');
  }
}

const filter = new AWSResource(name);
module.exports = filter;
