class Config {
  constructor() {
    // default config
    this.data = {
      secretTypes: [],
      maxFileSizeMiB: 10,
      maxConcurrentFileReads: 10,
      includedFiles: [],
      includedDirectories: [],
      includedFileExts: [],
      excludedFiles: ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'go.sum'],
      excludedDirectories: ['.git', 'node_modules', '.vscode'],
      excludedFileExts: [],
    };
  }

  getSecretTypes() {
    return this.data.secretTypes;
  }

  setSecretTypes(secretTypes) {
    this.data.secretTypes = secretTypes;
  }

  getMaxFileSizeMiB() {
    return this.data.maxFileSizeMiB;
  }

  setMaxFileSizeMiB(maxFileSizeMiB) {
    this.data.maxFileSizeMiB = maxFileSizeMiB;
  }

  getMaxConcurrentFileReads() {
    return this.data.maxConcurrentFileReads;
  }

  setMaxConcurrentFileReads(maxConcurrentFileReads) {
    this.data.maxConcurrentFileReads = maxConcurrentFileReads;
  }

  getIncludedFileExts() {
    return this.data.includedFileExts;
  }

  /**
   *
   * @param {Array<String>} includedFileExts case-insensitive
   */
  setIncludedFileExts(includedFileExts) {
    this.data.includedFileExts.push(...includedFileExts.map(ext => ext.toLowerCase()));
  }

  getIncludedFiles() {
    return this.data.includedFiles;
  }

  /**
   *
   * @param {Array<String>} includedFiles case-insensitive
   */
  setIncludedFiles(includedFiles) {
    this.data.includedFiles.push(...includedFiles.map(f => f.toLowerCase()));
  }

  getIncludedDirectories() {
    return this.data.includedDirectories;
  }

  /**
   *
   * @param {Array<String>} includedDirectories case-insensitive
   */
  setIncludedDirectories(includedDirectories) {
    const normalizedDirectories = includedDirectories.map((dir) => {
      let normalizedDir = dir.toLowerCase();
      // remove trailing slash, if any
      while (normalizedDir.endsWith('/')) {
        normalizedDir = normalizedDir.slice(0, -1);
      }
      return normalizedDir;
    })
    this.data.includedDirectories.push(...normalizedDirectories);
  }

  getExcludedFileExts() {
    return this.data.excludedFileExts;
  }

  /**
   *
   * @param {Array<String>} excludedFileExts case-insensitive
   */
  setExcludedFileExts(excludedFileExts) {
    this.data.excludedFileExts.push(...excludedFileExts.map(ext => ext.toLowerCase()));
  }

  getExcludedFiles() {
    return this.data.excludedFiles;
  }

  /**
   *
   * @param {Array<String>} excludedFiles case-insensitive
   */
  setExcludedFiles(excludedFiles) {
    this.data.excludedFiles.push(...excludedFiles.map(f => f.toLowerCase()));
  }

  getExcludedDirectories() {
    return this.data.excludedDirectories;
  }

  /**
   *
   * @param {Array<String>} excludedDirectories case-insensitive
   */
  setExcludedDirectories(excludedDirectories) {
    const normalizedDirectories = excludedDirectories.map((dir) => {
      let normalizedDir = dir.toLowerCase();
      // remove trailing slash, if any
      while (normalizedDir.endsWith('/')) {
        normalizedDir = normalizedDir.slice(0, -1);
      }
      return normalizedDir;
    })
    this.data.excludedDirectories.push(...normalizedDirectories);
  }
}

module.exports = Config;
