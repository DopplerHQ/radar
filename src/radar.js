const asyncPool = require("tiny-async-pool");

const Filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const File = require('./objects/file');
const ScannedFile = require('./objects/scannedfile');
const Scanner = require('./Scanner');
const Config = require('./config');
const FileClassifier = require('./file_classifier');

const OneMebibyte = 1024 * 1024;

class Radar {
  /**
   *
   * @param {Config} config
   * @param {function} onFilesToScan called with the total number of files to be scanned
   * @param {function} onFileScanned called whenever a file is scanned
   */
  constructor(config = new Config(), onFilesToScan = () => {}, onFileScanned = () => {}) {
    Object.keys(filetypes).forEach(filetype => config.setExcludedFileExts(filetypes[filetype].map(f => f.toLowerCase())));
    this._config = config;
    this._onFilesToScan = onFilesToScan;
    this._onFileScanned = onFileScanned;

    this._scanner = new Scanner();
    this._scanner.init(this._config.getSecretTypes());

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
        .then(results => Radar._getResultsMap(filePath, [results]));
    }
  }

  /**
   * @param {String} path
   * @param {Array<File>} filesToScan array of files to scan
   */
  async _getDirectoryFiles(path, filesToScan = []) {
    const dirEntries = await Filesystem.getDirectoryEntries(path, true);

    for (const entry of dirEntries) {
      const entryPath = `${path}/${entry.name}`;

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
    const fullPath = `${path}/${name}`;
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


  // TODO unit test these individual functions
  _isNameWhitelisted(name, relativePath) {
    const includedFiles = this._config.getIncludedFiles();
    return includedFiles.includes(name) || includedFiles.includes(relativePath);
  }

  _isNameBlacklisted(name, relativePath) {
    const excludedFiles = this._config.getExcludedFiles();
    return excludedFiles.includes(name) || excludedFiles.includes(relativePath);
  }

  _isExtensionWhitelisted(extension) {
    return this._config.getIncludedFileExts().reduce((acc, ext) => (
      acc || extension === ext || extension.endsWith(`.${ext}`)
    ), false)
  }

  _isExtensionBlacklisted(extension) {
    return this._config.getExcludedFileExts().reduce((acc, ext) => (
      acc || extension === ext || extension.endsWith(`.${ext}`)
    ), false)
  }

  /**
   * Check that the directory isn't blacklisted
   * @param {String} name
   * @param {String} relativePath Relative path to the directory from the original scan directory
   * @returns {Boolean}
   */
  _checkDirectory(name, relativePath) {
    const isNameWhitelisted = this._config.getIncludedDirectories().includes(name);
    if (isNameWhitelisted) {
      return true;
    }

    const excludedDirectories = this._config.getExcludedDirectories();
    const isNameBlacklisted = excludedDirectories.includes(name) || excludedDirectories.includes(relativePath);
    if (isNameBlacklisted) {
      return false;
    }

    const isRelativePathBlacklisted = excludedDirectories.reduce((acc, excludedDir) => (
      acc || `${relativePath}/`.startsWith(`${excludedDir}/`)
    ), false);
    if (isRelativePathBlacklisted) {
      return false;
    }

    return true;
  }

  /**
   * Check that the file size doesn't exceed the max
   * @param {Number} bytes
   * @return {Boolean}
   */
  _checkFileSize(bytes) {
    const mebibytes = (bytes / OneMebibyte);
    return mebibytes <= this._config.getMaxFileSizeMiB()
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
    this._scanner.findSecrets(line, scannedFile)
      .forEach(({ secret, secretType }) => scannedFile.addSecret(secret, secretType, line, lineNumber));
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
}

module.exports = { Radar, Config };
