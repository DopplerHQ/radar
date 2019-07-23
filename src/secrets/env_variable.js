const Secret = require('../Secret');
const FileTags = require('../objects/file_tags');

class EnvVariable extends Secret {
  constructor() {
    const name = 'env_variable';
    const filters = ['env_variable'];
    const fileTags = [FileTags.ENV_FILE];

    super(name, { filters, fileTags });
  }
}

const envVariable = new EnvVariable();
module.exports = envVariable;
