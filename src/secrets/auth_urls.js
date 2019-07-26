const Secret = require('../Secret');

class AuthUrls extends Secret {
  constructor() {
    const name = 'auth_url';
    const preFilters = ['path'];
    const filters = ['authurl'];

    super(name, { preFilters, filters });
  }
}

const authUrls = new AuthUrls();
module.exports = authUrls;
