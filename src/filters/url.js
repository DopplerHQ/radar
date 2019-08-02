const Filter = require('../objects/Filter');

// match protocol://
const urlRegex = /([a-z]+):\/\/.+/i;
// match urn: links
const urnRegex = /^urn:/;
// match [text](text)
const markdownLinkRegex = /\[[\w#-_:`\\/\.]+\]\([\w#-_:`\\/\.]+\)/;

class URL extends Filter {
  constructor() {
    super('URL');

    this.commonTLDs = Array.from(new Set([
      'com',
      'org',
      'net',
      'gov',
      'edu',
      'co.uk',
      'ru',
    ]));
  }

  isMatch(term) {
    if (urlRegex.test(term) || urnRegex.test(term) || markdownLinkRegex.test(term)) {
      return true;
    }

    const termLowerCase = term.toLowerCase();
    const termEndsWithCommonTLD = this.commonTLDs.reduce((acc, tld) => (
      acc || termLowerCase.endsWith(`.${tld}`)
    ), false);
    return termEndsWithCommonTLD;
  }
}

const filter = new URL();
module.exports = filter;
