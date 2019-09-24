const DefaultConfig = require('../config/defaults');
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

const getArray = (value = []) => {
  if (value instanceof Array) {
    return value;
  }
  return [value];
}

const getInteger = (value) => {
  if (Number.isSafeInteger(Number(value))) {
    return value;
  }
  return undefined;
}

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
      maxFindingsPerFile: DefaultConfig.maxFindingsPerFile,
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
      secretTypes: getValue(getArray(config.secretTypes), defaultConfig.secretTypes),
      maxFileSizeMiB: getValue(getInteger(config.maxFileSizeMiB), defaultConfig.maxFileSizeMiB),
      maxConcurrentFileReads: getValue(getInteger(config.maxConcurrentFileReads), defaultConfig.maxConcurrentFileReads),
      maxFindingsPerFile: getValue(getInteger(config.maxFindingsPerFile), defaultConfig.maxFindingsPerFile),
      includedFiles: getValue(getArray(config.includedFiles), defaultConfig.includedFiles).map(normalizeFile),
      includedDirectories: getValue(getArray(config.includedDirectories), defaultConfig.includedDirectories).map(normalizeDirectory),
      includedFileExts: getValue(getArray(config.includedFileExts), defaultConfig.includedFileExts).map(normalizeExtension),
      excludedFiles: getValue(getArray(config.excludedFiles), defaultConfig.excludedFiles).map(normalizeFile),
      excludedDirectories: getValue(getArray(config.excludedDirectories), defaultConfig.excludedDirectories).map(normalizeDirectory),
      excludedFileExts: getValue(getArray(config.excludedFileExts), defaultConfig.excludedFileExts).map(normalizeExtension),
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

  getMaxFindingsPerFile() {
    return this.data.maxFindingsPerFile;
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
