class Secret {
  /**
   *
   * @param {String} name
   * @param { preFilters: {Array<String>}, filters: {Array<String>}, extensions: {Array<String>}, excludedExtensions: {Array<String>} } options
   */
  constructor(name, { preFilters = [], filters = [], extensions = [], excludedExtensions = [], fileTags = [], excludedFileTags = [], shouldCacheShouldScan = true }) {
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
    // file tags to include, or blank list for all. include overrules an exclude
    this._fileTags = fileTags;
    // file tags to exclude
    this._excludedFileTags = excludedFileTags;
    // whether the initial result from shouldScan should be cached
    this._shouldCacheShouldScan = shouldCacheShouldScan;
  }

  name() {
    return this._name;
  }

  /**
   * Checks a line against
   * @param {Array<String>} terms
   * @param {ScannedFile} scannedFile
   * @returns {Array<String>} Detected secrets
   */
  check(terms, scannedFile) {
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
   * Whether the call to shouldScan should be cached
   * @returns {boolean}
   */
  shouldCacheShouldScan() {
    return this._shouldCacheShouldScan;
  }

  /**
   *
   * @param {ScannedFile} scannedFile
   * @returns {boolean} whether the file should be scanned by the current secret
   */
  shouldScan(scannedFile) {
    const file = scannedFile.file();
    const extension = file.extension().toLowerCase();

    const hasIncludedFileTag = this._fileTags.reduce((acc, tag) => (
      acc || scannedFile.tags().has(tag)
    ), false);
    const isExtensionWhitelisted = this._extensions.includes(extension);
    if (hasIncludedFileTag || isExtensionWhitelisted) {
      return true;
    }

    const hasExcludedFileTag = this._excludedFileTags.reduce((acc, excludedTag) => (
      acc || scannedFile.tags().has(excludedTag)
    ), false);
    const isExtensionBlacklisted = this._excludedExtensions.includes(extension);
    if (hasExcludedFileTag || isExtensionBlacklisted) {
      return false;
    }

    const acceptAllTags = (this._fileTags.length === 0);
    const acceptAllExtensions = (this._extensions.length === 0);
    return acceptAllTags || acceptAllExtensions;
  };
}

module.exports = Secret;
