const Filter = require('../objects/Filter');

class CommonPatterns extends Filter {
  constructor() {
    super('Common programming patterns');

    // find chained variables (e.g. foo.bar.method)
    this.chainedVariables = /^([a-zA-Z0-9]+\.){2,}[a-zA-Z0-9]+$/;
    // TODO write unit tests (--disable=PLUGIN1,PLUGIN2)
    this.featureFlag = /^--[a-zA-Z0-9]+=('|")?[a-zA-Z0-9 ,]+('|")?$/;
    // find variables (${})
    this.variableCurlyBraces = /\${.*}/;
  }

  isMatch(term) {
    return this.chainedVariables.test(term)
        || this.featureFlag.test(term)
        || this.variableCurlyBraces.test(term);
  }
}

const filter = new CommonPatterns();
module.exports = filter;
