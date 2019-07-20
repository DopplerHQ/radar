const Filter = require('../objects/Filter');
const mimeTypes = require('../mimetypes');

const name = 'MIME Type';

class CustomFilter extends Filter {
  checkMatch(term) {
    return mimeTypes.reduce((acc, type) => (
      acc || term.includes(type)
    ), false);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
