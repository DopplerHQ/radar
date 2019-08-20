const git = require("simple-git/promise");

const Filesystem = require('./filesystem');

class Git {
  static async clone(repo, branch = "master", path) {
    if (path === undefined) {
      path = await Filesystem.makeTempDirectory();
    }
    return git(path).clone(repo, path, ["--single-branch", "--depth", 1, "--branch", branch]);
  }
}

module.exports = Git;
