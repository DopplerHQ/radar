const Filter = require('../objects/Filter');

const name = 'Amazon AWS resource';

const uuidRegex = /[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}/;

class AWSResource extends Filter {
  checkMatch(term) {
    return uuidRegex.test(term);
  }
}

const filter = new AWSResource(name);
module.exports = filter;
