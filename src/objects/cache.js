class Cache {
  constructor() {
    this.data = new Map();
  }

  has(key) {
    return this.data.has(key);
  }

  get(key) {
    return this.has(key) ? this.data.get(key) : null;
  }

  set(key, value) {
    this.data.set(key, value);
    return this;
  }

  clear() {
    this.data.clear();
  }
}

module.exports = Cache;
