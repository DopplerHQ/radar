const Filter = require('../objects/Filter');

// match protocol://
const urlRegex = /([a-zA-Z]+):\/\/.+/;
// match urn: links
const urnRegex = /^urn:/;
// match [text](text)
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
