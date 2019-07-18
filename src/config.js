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
    this.data.includedDirectories.push(...includedDirectories);
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
    this.data.excludedDirectories.push(...excludedDirectories);
  }
}

module.exports = Config;
