class Filter {
  constructor(name) {
    if (name === undefined) {
      throw new Error("Filter name must be specified");
    }

    this._name = name;
  }

  isMatch(term) {
    throw new Error("This function must be implemented");
  }

  name() {
    return this._name;
  }
}

module.exports = Filter;
