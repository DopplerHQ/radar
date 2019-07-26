const Filter = require('../objects/Filter');

class Regex extends Filter {
  constructor() {
    super('Regex');

    // match open block `[` followed by two letter patterns (full alphabet or hex). case-insensitive. examples: `[a-zA-Z`, `[A-Za-z`, `[a-fA-F`, `[A-Fa-f`, `a-za-f`, `a-fa-z`, etc
    this.regexLettersWithLeadingBlock = /\[(a-z|a-f){2}/i;
    // same as previous but with close block `]` instead of open block
    this.regexLettersWithTrailingBlock = /(a-z|a-f){2}\]/i;
    // match open block `[` followed by letter pattern (full alphabet or hex) AND numeric pattern. case-insensitive. examples: `a-z0-9`, `a-f0-9`, `0-9a-z`, `0-9a-f`, etc
    this.regexMixedCharsWithLeadingBlock = /\[((a-z|a-f)0-9|0-9(a-z|a-f))/i;
    // same as previous but with close block `]` instead of open block
    this.regexMixedCharsWithTrailingBlock = /((a-z|a-f)0-9|0-9(a-z|a-f))\]/i;
    // match number of repetitions. examples: {2}, {2,}, {2,4}
    this.regexNumRepetitions = /\{[0-9]+(,[0-9]*)?\}/;
  }

  isMatch(term) {
    return this.regexLettersWithLeadingBlock.test(term)
          || this.regexLettersWithTrailingBlock.test(term)
          || this.regexMixedCharsWithLeadingBlock.test(term)
          || this.regexMixedCharsWithTrailingBlock.test(term)
          || this.regexNumRepetitions.test(term);
  }
}

const filter = new Regex();
module.exports = filter;
