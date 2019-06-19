const git = require("simple-git/promise");

class Git {
  static async clone(repo, path, branch = "master") {
    return git(path).clone(repo, path, ["--single-branch", "--depth", 1, "--branch", branch]);
  }
}

module.exports = Git;
