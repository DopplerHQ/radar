const path = require('path');

class File {
  /**
   * @param {String} name
   * @param {String} path
   * @param {Number} size
   */
  constructor(name, path, size) {
    this._name = name;
    this._path = path;
    this._size = size;
    this._extension = null;
    this._fullPath = null;
  }

  name() {
    return this._name;
  }

  fullPath() {
    if (this._fullPath === null) {
      this._fullPath = path.join(this._path, this._name);
    }

    return this._fullPath;
  }

  size() {
    return this._size;
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
