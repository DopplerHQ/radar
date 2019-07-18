const Secret = require('../Secret');

const name = 'Auth URL';
const preFilters = ['path'];
const filters = ['authurl'];

class AuthUrls extends Secret {
  constructor() {
    super(name, preFilters, filters);
  }
}

const authUrls = new AuthUrls();
module.exports = authUrls;
