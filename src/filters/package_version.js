const Filter = require('../objects/Filter');

class PackageVersion extends Filter {
  constructor() {
    super('Package Version');

    // honestly this regex is pretty complicated. see the unit tests for a clearer picture
    this.versionRegex = /^@?[a-z0-9]+(?:[:\/.\-][a-z0-9\-]+)+(?::|@)?\^?v?[0-9]+(?:\.[0-9]+)+(?:-[a-z0-9]+)?$/i;
  }

  isMatch(term) {
    return this.versionRegex.test(term);
  }
}

const filter = new PackageVersion();
module.exports = filter;
