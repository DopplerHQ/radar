const asyncPool = require("tiny-async-pool");
const Path = require('path');

const Filesystem = require('./filesystem');
const ExcludedFiletypes = require('../config/excluded_filetypes');
const File = require('./objects/file');
const ScannedFile = require('./objects/scannedfile');
const Scanner = require('./Scanner');
const Config = require('./config');
const FileClassifier = require('./file_classifier');

const OneMebibyte = 1024 * 1024;

class Radar {
  /**
   *
   * @param {Object} config
   * @param {function} onFilesToScan called with the total number of files to be scanned
   * @param {function} onFileScanned called whenever a file is scanned
   */
  constructor(config = {}, onFilesToScan = () => {}, onFileScanned = () => {}) {
    if (config.excludedFileExts === undefined) {
      config.excludedFileExts = [];
    }
    Object.keys(ExcludedFiletypes).forEach(filetype => (
      config.excludedFileExts.push(...ExcludedFiletypes[filetype].map(f => f.toLowerCase()))
    ));

    this._onFilesToScan = onFilesToScan;
    this._onFileScanned = onFileScanned;

    this._config = new Config(config);
    this._secretTypes = Scanner.loadSecretTypes(this._config.getSecretTypes());

    // verify all specified secret_types are valid
    if ((config.secretTypes !== undefined) && (config.secretTypes.length > 0)) {
      const allSecretTypes = this.listSecretTypes();
      config.secretTypes.forEach((secretType) => {
        if (!allSecretTypes.includes(secretType)) {
          throw new Error(`Invalid secret type ${secretType}`)
        }
      });
    }

    // these function gets executed outside of this context, so explicitly bind them
    this._onLineRead = this._onLineRead.bind(this);
    this._scanFile = this._scanFile.bind(this);
  }

  /**
   *
   * @param {String} path
   */
  async scan(path) {
    const stats = await Filesystem.getFileStats(path);

    await Filesystem.pathExists(path)
      .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

    if (stats.isDirectory()) {
      this.basePath = path;
      const filesToScan = await this._getDirectoryFiles(path);
      this._onFilesToScan(filesToScan.length);
      return asyncPool(this._config.getMaxConcurrentFileReads(), filesToScan, this._scanFile)
        .then(results => Radar._getResultsMap(path, results.filter(result => result.hasSecrets())));
    }

    if (stats.isFile()) {
      this._onFilesToScan(1);
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      const filePath = path.substring(0, path.lastIndexOf('/'));
      return this._getFileObject(filePath, fileName)
        .then(this._scanFile)
        .then(results => Radar._getResultsMap(filePath, [results].filter(result => result.hasSecrets())));
    }
  }

  /**
   * @param {String} path
   * @param {Array<File>} filesToScan array of files to scan
   */
  async _getDirectoryFiles(path, filesToScan = []) {
    const dirEntries = await Filesystem.getDirectoryEntries(path, true);

    for (const entry of dirEntries) {
      const entryPath = Path.join(path, entry.name);

      const relativePath = Filesystem.getRelativePath(entryPath, this.basePath);
      if (entry.isDirectory() && this._checkDirectory(entry.name, relativePath)) {
        await this._getDirectoryFiles(entryPath, filesToScan);
      }

      if (entry.isFile()) {
        const file = await this._getFileObject(path, entry.name);
        if (this._shouldScanFile(file)) {
          filesToScan.push(file);
        }
      }
    }

    return filesToScan;
  }

  /**
   *
   * @param {String} path
   * @param {String} name
   * @returns {File}
   */
  async _getFileObject(path, name) {
    const fullPath = Path.join(path, name);
    const fileStats = await Filesystem.getFileStats(fullPath);
    const fileSize = fileStats.size;
    return new File(name, path, fileSize);
  }

  /**
   *
   * @param {File} file
   * @returns {Boolean}
   */
  _shouldScanFile(file) {
    const name = file.name().toLowerCase();
    const size = file.size();
    const ext = file.extension().toLowerCase();
    const path = file.fullPath();

    const relativePath = Filesystem.getRelativePath(path, this.basePath);
    if (this._checkFileName(name, ext, relativePath) && this._checkFileSize(size)) {
      return true;
    }

    return false;
  }

  /**
   * Check that the file name isn't blacklisted. Name white/blacklisting takes precedence over extension white/blacklisting
   * @param {String} name
   * @param {String} ext
   * @returns {Boolean} true if the file is ok, false if it's blacklisted
   */
  _checkFileName(name, ext, relativePath) {
    if (this._isNameWhitelisted(name, relativePath)) {
      return true;
    }

    if (this._isNameBlacklisted(name, relativePath)) {
      return false;
    }

    if (this._isExtensionWhitelisted(ext)) {
      return true;
    }

    if (this._isExtensionBlacklisted(ext)) {
      return false;
    }

    return true;
  }

  /**
   * Check that the directory isn't blacklisted
   * @param {String} name the directory name
   * @param {String} relativePath Relative path to the directory from the original scan directory. should include the directory name
   * @returns {Boolean}
   */
  _checkDirectory(name, relativePath = "") {
    const nameLower = name.toLowerCase();
    const relativePathLower = relativePath.toLowerCase();

    if (this._isDirectoryWhitelisted(nameLower, relativePathLower)) {
      return true;
    }

    if (this._isDirectoryBlacklisted(nameLower, relativePathLower)) {
      return false;
    }

    return true;
  }

  // TODO unit test these individual functions
  _isNameWhitelisted(name, relativePath) {
    const includedFiles = this._config.getIncludedFiles();
    return includedFiles.includes(name) || includedFiles.includes(relativePath);
  }

  _isNameBlacklisted(name, relativePath) {
    const excludedFiles = this._config.getExcludedFiles();
    return excludedFiles.includes(name) || excludedFiles.includes(relativePath);
  }

  _isDirectoryWhitelisted(name, relativePath) {
    const includedDirectories = this._config.getIncludedDirectories();
    if (includedDirectories.includes(name) || includedDirectories.reduce((acc, dir) => acc || name.endsWith(dir), false)) {
      return true;
    }

    const isRelativePathIncluded = includedDirectories.includes(relativePath) || includedDirectories.reduce((acc, includedDir) => (
      acc || `${relativePath}/`.startsWith(`${includedDir}/`)
    ), false);
    return isRelativePathIncluded;
  }

  _isDirectoryBlacklisted(name, relativePath) {
    const excludedDirectories = this._config.getExcludedDirectories();
    const isDirectoryExcluded = excludedDirectories.includes(name) || excludedDirectories.reduce((acc, dir) => acc || name.endsWith(dir), false);
    if (isDirectoryExcluded) {
      return true;
    }

    const isRelativePathExcluded = excludedDirectories.includes(relativePath) || excludedDirectories.reduce((acc, excludedDir) => (
      acc || `${relativePath}/`.startsWith(`${excludedDir}/`)
    ), false);
    return isRelativePathExcluded;
  }

  _isExtensionWhitelisted(fileExt) {
    return this._config.getIncludedFileExts().reduce((acc, extension) => (
      acc || fileExt === extension || fileExt.endsWith(`.${extension}`)
    ), false)
  }

  _isExtensionBlacklisted(fileExt) {
    return this._config.getExcludedFileExts().reduce((acc, extension) => (
      acc || fileExt === extension || fileExt.endsWith(`.${extension}`)
    ), false)
  }

  /**
   * Check that the file size doesn't exceed the max
   * @param {Number} bytes
   * @return {Boolean}
   */
  _checkFileSize(bytes) {
    const mebibytes = (bytes / OneMebibyte);
    const maxFileSizeMiB = this._config.getMaxFileSizeMiB();
    return (maxFileSizeMiB <= 0)
      ? true
      : mebibytes <= maxFileSizeMiB;
  }

  /**
   * @param {File} file
   * @returns {ScannedFile}
   */
  async _scanFile(file) {
    const scannedFile = new ScannedFile(file);
    FileClassifier.classify(file)
      .forEach(tag => scannedFile.addTag(tag, true));
    await Filesystem.readFile(scannedFile, this._onLineRead)
      .catch(() => {});
    this._onFileScanned();
    return scannedFile;
  }

  /**
   * @param {ScannedFile} scannedFile
   * @param {String} line
   * @param {Number} lineNumber
   */
  _onLineRead(scannedFile, line, lineNumber) {
    Scanner.findSecrets(this._secretTypes, line, scannedFile)
      .forEach(({ secret, secretType, metadata }) => scannedFile.addSecret(secret, secretType, line, lineNumber, metadata));
  }

  /**
   *
   * @param {String} path
   * @param {Array<ScannedFile>} scanResults
   */
  static _getResultsMap(path, scanResults) {
    const results = {};
    scanResults.forEach((scannedFile) => {
      const relativePath = Filesystem.getRelativePath(scannedFile.file().fullPath(), path);
      results[relativePath] = scannedFile.toObject();
    });
    return results;
  }

  listSecretTypes() {
    return this._secretTypes
      .map(({ name }) => name)
  }

  listFilters() {
    return Scanner.getFilters()
      .map(file => file.substring(0, file.indexOf('.')));
  }

  config() {
    return this._config.config();
  }
}

module.exports = Radar;
