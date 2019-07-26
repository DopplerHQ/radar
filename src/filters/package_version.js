const Filter = require('../objects/Filter');

class PackageVersion extends Filter {
  constructor() {
    super('Package Version');

    // look for npm version format w/ major/minor/revision (e.g. @2.0.1, @^2.0.1)
    this.versionRegex = /@\^?[0-9]+\.[0-9]+\.[0-9]+/;
  }

  isMatch(term) {
    return this.versionRegex.test(term);
  }
}

const filter = new PackageVersion();
module.exports = filter;
