const Filter = require('../objects/Filter');

class EnvVariable extends Filter {
  constructor() {
    super('Environment variable');

    // match NAME=VALUE, NAME="VALUE", and NAME='VALUE'
    this.envVariableRegex = /^[\w]+=('|")?[\w]+('|")?$/;
  }

  isMatch(term) {
    return this.envVariableRegex.test(term);
  }
}

const filter = new EnvVariable();
module.exports = filter;
