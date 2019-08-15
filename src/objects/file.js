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
  }

  name() {
    return this._name;
  }

  fullPath() {
    return `${this._path}/${this._name}`;
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
