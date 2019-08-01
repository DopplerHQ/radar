const Filter = require('../objects/Filter');
const mimeTypes = require('../../config/mimetypes');

class MIMETypes extends Filter {
  constructor() {
    super('MIME Type');
  }

  isMatch(term) {
    return mimeTypes.reduce((acc, type) => (
      acc || term.includes(type)
    ), false);
  }
}

const filter = new MIMETypes();
module.exports = filter;
