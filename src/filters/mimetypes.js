const Filter = require('../objects/Filter');
const mimeTypes = require('../mimetypes');

class MIMETypes extends Filter {
  constructor() {
    super('MIME Type');
  }

  checkMatch(term) {
    return mimeTypes.reduce((acc, type) => (
      acc || term.includes(type)
    ), false);
  }
}

const filter = new MIMETypes();
module.exports = filter;
