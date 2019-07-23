const Filter = require('../objects/Filter');

const versionRegex = /@\^?[0-9]+\.[0-9]\.[0-9]/;

class PackageVersion extends Filter {
  constructor() {
    super('Package Version');
  }

  isMatch(term) {
    return versionRegex.test(term);
  }
}

const filter = new PackageVersion();
module.exports = filter;
