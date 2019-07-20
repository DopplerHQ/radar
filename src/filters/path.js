const Filter = require('../objects/Filter');

class Path extends Filter {
  constructor() {
    super('File path');
  }

  checkMatch(term) {
    const hasPathNavigation = (term.includes('../') || term.includes('./') || term.includes('C:\\\\') || term.includes('c:\\\\'));
    const hasMultiplePathSeparators = (!term.includes('://') && ((term.match(/\//g) || []).length >= 2));
    return (hasPathNavigation || hasMultiplePathSeparators);
  }
}

const filter = new Path();
module.exports = filter;
