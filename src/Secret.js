class Secret {
  /**
   *
   * @param {Array<String>} preFilters
   * @param {Array<String>} filters
   * @param {Array<String>} extensions
   */
  constructor(name, preFilters = [], filters = [], extensions = []) {
    if (name === undefined) {
      throw new Error("Secret name must be specified");
    }

    this._name = name;
    // must match all pre-filters
    this._preFilters = preFilters.map(name => require(`./filters/${name}`));
    // must match at least one filter
    this._filters = filters.map(name => require(`./filters/${name}`));
    // extension must be in list, or blank list to support all extensions
    this._extensions = extensions;
  }

  name() {
    return this._name;
  }

  /**
   * Checks a line against
   * @param {Array<String>} terms
   * @returns {Array<String>} Detected secrets
   */
  check(terms) {
    return terms.filter((term) => {
      const matchesAnyPreFilters = this._preFilters.reduce((acc, preFilter) => (
        acc || preFilter.checkMatch(term)
      ), false);
      return !matchesAnyPreFilters;
    })
      .filter((term) => {
        const matchesAnyFilter = this._filters.reduce((acc, filter) => (
          acc || filter.checkMatch(term)
        ), false);
        return matchesAnyFilter;
      })
  }

  /**
   * Splits a line of text into each of its terms
   * @param {String} line
   * @returns {Array<String>}
   */
  getTerms(line) {
    return line.split(/ +/)
  };

  /**
   *
   * @param {File} file
   */
  shouldScan(file) {
    return (this._extensions.length === 0) || this._extensions.includes(file.extension())
  };
}

module.exports = Secret;
