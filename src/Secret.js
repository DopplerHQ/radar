class Secret {
  /**
   * Pre-filters and filters will be tested in the order they're specified
   * @param {String} name
   * @param {{ preFilters: Array<String>, filters: Array<String>, fileTags: Array<FileTags>, excludedFileTags: Array<FileTags> }} options
   */
  constructor(name, { preFilters = [], filters = [], fileTags = [], excludedFileTags = [] } = {}) {
    if (name === undefined) {
      throw new Error("Secret name must be specified");
    }

    this._name = name;
    // must not match any pre-filter
    this._preFilters = preFilters.map(name => require(`./filters/${name}`));
    // must match any filter
    this._filters = filters.map(name => require(`./filters/${name}`));
    // file tags to include, or blank list for all. include overrules an exclude
    this._fileTags = fileTags;
    // file tags to exclude
    this._excludedFileTags = excludedFileTags;
  }

  name() {
    return this._name;
  }

  /**
   * Checks a list of terms against the secret's filters
   * @param {Array<String>} terms
   * @returns {{ secrets: string[]; tags: []; metadata: {} }} Detected secrets and tags to add/remove from the file
   */
  check(terms) {
    const secrets = terms.filter((term) => {
      const matchesAnyPreFilters = this._preFilters.some(preFilter => preFilter.isMatch(term));
      return !matchesAnyPreFilters;
    })
      .filter((term) => {
        const matchesAnyFilters = this._filters.some(filter => filter.isMatch(term));
        return matchesAnyFilters;
      });

    return {
      secrets,
      tags: [],
      metadata: {},
    }
  }

  /**
   * Splits a line of text into each of its terms
   * @param {String} line
   * @returns {Array<String>}
   */
  getTerms(line) {
    return line.split(/ +/)
  }

  /**
   *
   * @param {Set<FileTags>} tags
   * @returns {boolean} whether the file should be scanned by the current secret
   */
  shouldScan(tags) {
    const hasIncludedFileTag = this._fileTags.reduce((acc, tag) => (
      acc || tags.has(tag)
    ), false);
    if (hasIncludedFileTag) {
      return true;
    }

    const hasExcludedFileTag = this._excludedFileTags.reduce((acc, excludedTag) => (
      acc || tags.has(excludedTag)
    ), false);
    if (hasExcludedFileTag) {
      return false;
    }

    const acceptAllTags = (this._fileTags.length === 0);
    return acceptAllTags;
  }
}

module.exports = Secret;
