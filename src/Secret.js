class Secret {
  /**
   *
   * @param {String} name
   * @param { preFilters: {Array<String>}, filters: {Array<String>}, extensions: {Array<String>}, excludedExtensions: {Array<String>} } options
   */
  constructor(name, { preFilters = [], filters = [], extensions = [], excludedExtensions = [] }) {
    if (name === undefined) {
      throw new Error("Secret name must be specified");
    }

    this._name = name;
    // must not match any pre-filter
    this._preFilters = preFilters.map(name => require(`./filters/${name}`));
    // must match all filters
    this._filters = filters.map(name => require(`./filters/${name}`));
    // extensions to include, or blank list for all. include overrules an exclude
    this._extensions = extensions;
    // extensions to exclude
    this._excludedExtensions = excludedExtensions;
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
        const matchesAllFilters = this._filters.reduce((acc, filter) => (
          acc && filter.checkMatch(term)
        ), true);
        return matchesAllFilters;
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
    const extension = file.extension().toLowerCase();

    const isWhitelisted = this._extensions.includes(extension);
    if (isWhitelisted)
      return true;

    const isBlacklisted = this._excludedExtensions.includes(extension)
    if (isBlacklisted)
      return false;

    const acceptAllExtensions = (this._extensions.length === 0);
    return acceptAllExtensions;
  };
}

module.exports = Secret;
