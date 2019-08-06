const Filter = require('../objects/Filter');

class XMLTag extends Filter {
  constructor() {
    super('XML/HTML Tag');

    // find open tag with preceding closing bracket (e.g. ><title>)
    this.xmlOpeningTagRegex = /><.*>/;
    // find closing tag (e.g. </title>)
    this.xmlClosingTagRegex = /<\/.*>/;
  }

  isMatch(term) {
    return this.xmlOpeningTagRegex.test(term) || this.xmlClosingTagRegex.test(term);
  }
}

const filter = new XMLTag();
module.exports = filter;
