/**
 * Determines the appropriate value given an optional value and a default value. Arrays will be merged.
 * @param {Any} value optional
 * @param {Any} defaultValue required
 */
const getValue = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (defaultValue instanceof Array) {
    const isValueEmpty = value.length === 0;
    const isDefaultValueEmpty = defaultValue.length === 0;

    if (isValueEmpty) return defaultValue;
    if (isDefaultValueEmpty) return value;
    return [...defaultValue, ...value];
  }

  return value;
};

const normalizeDirectory = (directory) => {
  let lowercaseDirectory = directory.toLowerCase();
  // remove trailing slash, if any
  while (lowercaseDirectory.endsWith('/')) {
    lowercaseDirectory = lowercaseDirectory.slice(0, -1);
  }
  return lowercaseDirectory;
};

class Config {
  constructor(config = {}) {
    const defaultConfig = {
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

    this.data = {
      secretTypes: getValue(config.secretTypes, defaultConfig.secretTypes),
      maxFileSizeMiB: getValue(config.maxFileSizeMiB, defaultConfig.maxFileSizeMiB),
      maxConcurrentFileReads: getValue(config.maxConcurrentFileReads, defaultConfig.maxConcurrentFileReads),
      includedFiles: getValue(config.includedFiles, defaultConfig.includedFiles).map(ext => ext.toLowerCase()),
      includedDirectories: getValue(config.includedDirectories, defaultConfig.includedDirectories).map(normalizeDirectory),
      includedFileExts: getValue(config.includedFileExts, defaultConfig.includedFileExts).map(ext => ext.toLowerCase()),
      excludedFiles: getValue(config.excludedFiles, defaultConfig.excludedFiles).map(ext => ext.toLowerCase()),
      excludedDirectories: getValue(config.excludedDirectories, defaultConfig.excludedDirectories).map(normalizeDirectory),
      excludedFileExts: getValue(config.excludedFileExts, defaultConfig.excludedFileExts).map(ext => ext.toLowerCase()),
    };
  }

  getSecretTypes() {
    return this.data.secretTypes;
  }

  getMaxFileSizeMiB() {
    return this.data.maxFileSizeMiB;
  }

  getMaxConcurrentFileReads() {
    return this.data.maxConcurrentFileReads;
  }

  getIncludedFileExts() {
    return this.data.includedFileExts;
  }

  getIncludedFiles() {
    return this.data.includedFiles;
  }

  getIncludedDirectories() {
    return this.data.includedDirectories;
  }

  getExcludedFileExts() {
    return this.data.excludedFileExts;
  }

  getExcludedFiles() {
    return this.data.excludedFiles;
  }

  getExcludedDirectories() {
    return this.data.excludedDirectories;
  }
}

module.exports = Config;
