const Filter = require('../objects/Filter');

class URL extends Filter {
  constructor() {
    super('URL');

    // match `PROTOCOL://`
    this.urlRegex = /([a-z]+):\/\/.+/i;

    this.commonTLDs = Array.from(new Set([
      'com',
      'org',
      'net',
      'gov',
      'edu',
      'biz',
      'io',
      'info',
      'mil',
      'us',
      'co.uk',
      'de',
      'ru',
    ]));
  }

  isMatch(term) {
    const isMarkdownLink = term.includes("](");
    const isUrn = term.startsWith("urn:");
    if (isMarkdownLink || isUrn || this.urlRegex.test(term)) {
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
