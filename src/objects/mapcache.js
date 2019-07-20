class MapCache {
  constructor() {
    this.data = new Map();
  }

  /**
   *
   * @param {String} key
   * @returns {boolean}
   */
  has(key) {
    return this.data.has(key);
  }

  /**
   *
   * @param {String} key
   * @returns {Map<String, bool>}
   */
  get(key) {
    if (!this.has(key)) {
      this.set(key, new Map());
    }
    return this.data.get(key);
  }

  /**
   *
   * @param {String} key
   * @param {Map<String, bool>} value
   */
  set(key, value) {
    this.data.set(key, value);
    return this;
  }

  clear() {
    this.data.clear();
  }
}

module.exports = MapCache;
