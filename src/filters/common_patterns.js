const Filter = require('../objects/Filter');

class CommonPatterns extends Filter {
  constructor() {
    super('Common programming patterns');

    // find chained variables (e.g. foo.bar.method, foo::bar::method)
    this.chainedVariables = /(?:\w{2,}(?:\.|\:\:)){2,}\w+/;
    this.chainedVariablesFunctionCall = /^\w{2,}(?:(?:\.|\:\:)\w{2,})+(\(|<)/;
    // find feature flags (e.g. --option=value)
    this.featureFlag = /^--\w[\w-]*=(?:'|")?[\w,:]+(?:'|")?$/;
    // find variables (${} #{} %{})
    this.variableCurlyBraces = /(?:\$|#|%){.*}/;
    this.variableParentheses = /\$\(.*\)/;
    // find variables ending with a number
    this.variableWithVersion = /^([a-z_]+(\.|:))+[a-z_]+(=|:)[0-9]+(\.[0-9]+)*$/i;
    this.arrayAccess = /\[[0-9]\]/;
  }

  isMatch(term) {
    const isComment = term.includes('/*') || term.includes('*/');
    return isComment
        || this.arrayAccess.test(term)
        || this.chainedVariables.test(term)
        || this.chainedVariablesFunctionCall.test(term)
        || this.featureFlag.test(term)
        || this.variableCurlyBraces.test(term)
        || this.variableParentheses.test(term)
        || this.variableWithVersion.test(term);
  }
}

const filter = new CommonPatterns();
module.exports = filter;
