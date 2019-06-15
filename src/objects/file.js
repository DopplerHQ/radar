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
    const lastPeriod = this._name.lastIndexOf('.');
    if (lastPeriod === -1) {
      return '';
    }

    return this._name.substring(lastPeriod + 1);
  }
}

module.exports = File;
