const Filter = require('../objects/Filter');

class AWSResource extends Filter {
  constructor() {
    super('Amazon AWS resource');
  }

  isMatch(term) {
    return term.startsWith('arn:aws:');
  }
}

const filter = new AWSResource();
module.exports = filter;
