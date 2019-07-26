const Filter = require('../objects/Filter');

class Path extends Filter {
  constructor() {
    super('File path');
  }

  isMatch(term) {
    const hasPathNavigation = (term.includes('../') || term.includes('./') || term.includes('C:\\\\') || term.includes('c:\\\\'));
    return hasPathNavigation;
  }
}

const filter = new Path();
module.exports = filter;
