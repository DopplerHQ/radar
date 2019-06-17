const clone = require('git-clone');

class Git {
  static async clone(repo, path) {
    return new Promise((resolve, reject) => {
      clone(repo, path, { shallow: true }, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    });
  }
}

module.exports = Git;
