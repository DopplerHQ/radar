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
      excludedFiles: ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock'],
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

  setIncludedFileExts(includedFileExts) {
    this.data.includedFileExts.push(...includedFileExts);
  }

  getIncludedFiles() {
    return this.data.includedFiles;
  }

  setIncludedFiles(includedFiles) {
    this.data.includedFiles.push(...includedFiles);
  }

  getIncludedDirectories() {
    return this.data.includedDirectories;
  }

  setIncludedDirectories(includedDirectories) {
    const normalizedDirectories = includedDirectories.map((dir) => {
      let normalizedDir = dir;
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

  setExcludedFileExts(excludedFileExts) {
    this.data.excludedFileExts.push(...excludedFileExts);
  }

  getExcludedFiles() {
    return this.data.excludedFiles;
  }

  setExcludedFiles(excludedFiles) {
    this.data.excludedFiles.push(...excludedFiles);
  }

  getExcludedDirectories() {
    return this.data.excludedDirectories;
  }

  setExcludedDirectories(excludedDirectories) {
    const normalizedDirectories = excludedDirectories.map((dir) => {
      let normalizedDir = dir;
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
