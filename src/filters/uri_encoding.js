const Filter = require('../objects/Filter');

class URIEncoding extends Filter {
  constructor() {
    super('URI Encoding');

    this.encodedCharacterRegex = /%[a-f0-9]{2}/ig;
  }

  isMatch(term) {
    const encodedCharacters = term.match(this.encodedCharacterRegex);
    // require at least 2 encoded characters
    return (encodedCharacters !== null) && (encodedCharacters.length >= 2);
  }
}

const filter = new URIEncoding();
module.exports = filter;
