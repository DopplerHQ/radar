const Filter = require('../objects/Filter');

const name = 'Regex';

const regexCharacterSet1 = /\[((a-z){2}|a-z0-9|0-9a-z)/i;
const regexCharacterSet2 = /((a-z){2}|a-z0-9|0-9a-z)\]/i;
const regexCharacterSet3 = /\[(a-fA-F|A-Fa-f|a-f0-9|0-9a-f)/i;
const regexCharacterSet4 = /((a-f){2}|a-f0-9|0-9a-f)\]/i;
const regexNumRepetitions = /\{[0-9]+,[0-9]*\}/;

class CustomFilter extends Filter {
  checkMatch(term) {
    return regexCharacterSet1.test(term)
          || regexCharacterSet2.test(term)
          || regexCharacterSet3.test(term)
          || regexCharacterSet4.test(term)
          || regexNumRepetitions.test(term);
  }
}

const filter = new CustomFilter(name);
module.exports = filter;
