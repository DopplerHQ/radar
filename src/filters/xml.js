const Filter = require('../objects/Filter');

class XMLTag extends Filter {
  constructor() {
    super('XML/HTML Tag');

    this.xmlTagRegex = /(?:^|\s)<.*>.*<\/.*>/;
  }

  isMatch(term) {
    return this.xmlTagRegex.test(term);
  }
}

const filter = new XMLTag();
module.exports = filter;
