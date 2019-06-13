class Key {
  /**
   * @param {String} key
   * @param {Number} line
   */
  constructor(key, line, confidence) {
    this._key = key;
    this._line = line;
    this._confidence = confidence;
  }

  key() {
    return this._key;
  }

  line() {
    return this._line;
  }

  confidence() {
    return this._confidence;
  }
}

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

class ScannedFile {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
    this._keys = [];
  }

  file() {
    return this._file;
  }

  keys() {
    return this._keys;
  }

  hasKeys() {
    return (this._keys.length !== 0);
  }

  /**
   * @param {Key} key
   */
  addKey(key) {
    this._keys.push(key);
  }

  toObject() {
    const object = {};
    object.metadata = {
      fileSize: this._file.size(),
      fileExtension: this._file.extension(),
    };
    object.keys = this._keys.map(key => ({
      key: key.key(),
      lineNumber: key.line(),
      score: key.confidence(),
    }));
    return object;
  }
}

module.exports = { Key, File, ScannedFile };
