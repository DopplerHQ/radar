const DefaultConfig = require('./dictionaries/config');
const ExcludedFiletypes = require('../config/excluded_filetypes');

/**
 * Determines the appropriate value given an optional value and a default value. Arrays will be merged.
 * @param {any} value optional
 * @param {any} defaultValue required
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

const normalizeFile = (file) => {
  return file.toLowerCase();
};

const normalizeDirectory = (directory) => {
  let lowercaseDirectory = directory.toLowerCase();
  // remove trailing slash, if any
  while (lowercaseDirectory.endsWith('/')) {
    lowercaseDirectory = lowercaseDirectory.slice(0, -1);
  }
  return lowercaseDirectory;
};

const normalizeExtension = (extension) => {
  return extension.toLowerCase();
};

class Config {
  constructor(config = {}) {
    const defaultConfig = {
      secretTypes: DefaultConfig.secretTypes,
      maxFileSizeMiB: DefaultConfig.maxFileSizeMiB,
      maxConcurrentFileReads: DefaultConfig.maxConcurrentFileReads,
      includedFiles: DefaultConfig.includedFiles,
      includedDirectories: DefaultConfig.includedDirectories,
      includedFileExts: DefaultConfig.includedFileExts,
      excludedFiles: DefaultConfig.excludedFiles,
      excludedDirectories: DefaultConfig.excludedDirectories,
      excludedFileExts: DefaultConfig.excludedFileExts,
    };

    Object.keys(ExcludedFiletypes).forEach(filetype => (
      defaultConfig.excludedFileExts.push(...ExcludedFiletypes[filetype].map(f => f.toLowerCase()))
    ));

    this.data = {
      secretTypes: getValue(config.secretTypes, defaultConfig.secretTypes),
      maxFileSizeMiB: getValue(config.maxFileSizeMiB, defaultConfig.maxFileSizeMiB),
      maxConcurrentFileReads: getValue(config.maxConcurrentFileReads, defaultConfig.maxConcurrentFileReads),
      includedFiles: getValue(config.includedFiles, defaultConfig.includedFiles).map(normalizeFile),
      includedDirectories: getValue(config.includedDirectories, defaultConfig.includedDirectories).map(normalizeDirectory),
      includedFileExts: getValue(config.includedFileExts, defaultConfig.includedFileExts).map(normalizeExtension),
      excludedFiles: getValue(config.excludedFiles, defaultConfig.excludedFiles).map(normalizeFile),
      excludedDirectories: getValue(config.excludedDirectories, defaultConfig.excludedDirectories).map(normalizeDirectory),
      excludedFileExts: getValue(config.excludedFileExts, defaultConfig.excludedFileExts).map(normalizeExtension),
    };
  }

  config() {
    return this.data;
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
