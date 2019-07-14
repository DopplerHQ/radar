class Config {
  constructor() {
    // default config
    this.data = {
      maxFileSizeMiB: 10,
      minMatchScore: 0.7,
      maxConcurrentFileReads: 10,
      includedFiles: [],
      includedDirectories: [],
      includedFileExts: [],
      excludedFiles: ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock'],
      excludedDirectories: ['.git', 'node_modules', '.vscode'],
      excludedFileExts: [],
    };
  }

  getMaxFileSizeMiB() {
    return this.data.maxFileSizeMiB;
  }

  setMaxFileSizeMiB(maxFileSizeMiB) {
    this.data.maxFileSizeMiB = maxFileSizeMiB;
  }

  getMinMatchScore() {
    return this.data.minMatchScore;
  }

  setMinMatchScore(minMatchScore) {
    this.data.minMatchScore = minMatchScore;
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
