const Path = require('path');

/**
 *
 * @param {String} path
 * @param {String} basePath
 * @returns {String}
 */
const getRelativePath = (path, basePath) => {
  if (!path.includes('/') || !basePath.includes('/') || !path.startsWith(basePath)) {
    return path;
  }

  let relativePath = path.substring(basePath.length);
  while (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
  }
  return relativePath;
}

class File {
  /**
   * @param {String} name
   * @param {String} path
   * @param {String} basePath
   * @param {Number} size
   */
  constructor(name, path = "", basePath = "", size = 0) {
    this._name = name;
    this._path = Path.normalize(path);
    this._basePath = Path.normalize(basePath);
    this._size = size;
    this._extension = null;
    this._fullPath = null;
    this._relativePath = null;
    this._numLines = 0;
  }

  name() {
    return this._name;
  }

  path() {
    return this._path;
  }

  fullPath() {
    if (this._fullPath === null) {
      this._fullPath = Path.join(this._path, this._name);
    }

    return this._fullPath;
  }

  relativePath() {
    if (this._relativePath === null) {
      const fullPath = this.fullPath();
      this._relativePath = getRelativePath(fullPath, this._basePath);
    }

    return this._relativePath;
  }

  size() {
    return this._size;
  }

  numLines() {
    return this._numLines;
  }

  incrNumLines() {
    this._numLines += 1;
  }

  extension() {
    if (this._extension === null) {
      this._extension = (() => {
        const firstPeriod = this._name.indexOf('.');
        if (firstPeriod === -1) {
          return '';
        }

        return this._name.substring(firstPeriod + 1);
      })();
    }

    return this._extension;
  }
}

module.exports = File;
