const Filter = require('../objects/Filter');

const urlRegex = /([a-zA-Z]+):\/\/.+/;
const urnRegex = /^urn:/;
const markdownLinkRegex = /\[[\w#-:\\/\.]+\]\([\w#-:\\/\.]+\)/;

class URL extends Filter {
  constructor() {
    super('URL');
  }

  isMatch(term) {
    return urlRegex.test(term) || urnRegex.test(term) || markdownLinkRegex.test(term);
  }
}

const filter = new URL();
module.exports = filter;
