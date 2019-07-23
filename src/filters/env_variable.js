const Filter = require('../objects/Filter');

class EnvVariable extends Filter {
  constructor() {
    super('Environment variable');
    this.envVariableRegex = /^[\w]+=('|")?[\w]+('|")?$/;
  }

  isMatch(term) {
    return this.envVariableRegex.test(term);
  }

  getTerms(line) {
    return [line];
  }
}

const filter = new EnvVariable();
module.exports = filter;
