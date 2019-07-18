const Filter = require('../objects/Filter');

const name = 'File path';

class CustomFilter extends Filter {
  checkMatch(term) {
    const hasPathNavigation = (term.includes('../') || term.includes('./') || term.includes('C:\\\\') || term.includes('c:\\\\'));
    const hasMultiplePathSeparators = (!term.includes('://') && ((term.match(/\//g) || []).length >= 2));
    return (hasPathNavigation || hasMultiplePathSeparators);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
