const defaultConfig = {
  maxFileSizeMiB: 10,
  includedFileExts: [],
  excludedFileExts: [],
  excludedFiles: ['package-lock.json', 'npm-shrinkwrap.json'],
  excludedDirectories: ['.git', 'node_modules', '.vscode'],
};
Object.freeze(defaultConfig);

class Config {
  constructor() {
    this.data = {};
    Object.keys(defaultConfig).forEach(key => this.data[key] = defaultConfig[key]);
  }

  getMaxFileSizeMiB() {
    return this.data.maxFileSizeMiB;
  }

  setMaxFileSizeMiB(maxFileSizeMiB) {
    this.data.maxFileSizeMiB = maxFileSizeMiB;
  }

  getIncludedFileExts() {
    return this.data.includedFileExts;
  }

  setIncludedFileExts(includedFileExts) {
    this.data.includedFileExts.push(...includedFileExts);
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
