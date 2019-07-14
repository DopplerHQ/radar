const compoundExtensions = ["tar", "min"];

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
    if (this._extension == null) {
      this._extension = (() => {
        const lastPeriod = this._name.lastIndexOf('.');
        const secondLastPeriod = this._name.lastIndexOf('.', lastPeriod - 1);
        if (secondLastPeriod !== lastPeriod) {
          const compoundExt = this._name.substring(secondLastPeriod + 1, lastPeriod);
          if (compoundExtensions.includes(compoundExt)) {
            return this._name.substring(secondLastPeriod + 1);
          }
        }
        if (lastPeriod === -1) {
          return '';
        }

        return this._name.substring(lastPeriod + 1);
      })();
    }

    return this._extension;
  }
}

module.exports = File;
