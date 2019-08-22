const Filter = require('../src/objects/Filter');

class ExampleFilter extends Filter {
  constructor() {
    super("Example filter");
  }

  isMatch(term) {
    // find terms containing the word "example"
    return term.includes("example");
  }
}

const filter = new ExampleFilter();
module.exports = filter;
