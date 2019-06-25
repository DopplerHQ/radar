const Filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const File = require('./objects/file');
const Key = require('./objects/key');
const ScannedFile = require('./objects/scannedfile');
const Scanner = require('./scanner');
const Config = require('./config');

const oneMebibyte = 1024 * 1024;

/**
TODO:
- support globs (folders and asterisks)
- test against an api leak list to check effectiveness and false positive rate
*/

class Radar {
  constructor(config = new Config()) {
    Object.keys(filetypes).forEach(filetype => config.setExcludedFileExts(filetypes[filetype]));
    this._config = config;
  }

  async scan(path) {
    const stats = await Filesystem.getFileStats(path);

    await Filesystem.pathExists(path)
      .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

    if (stats.isDirectory()) {
      return this._scanDirectory(path);
    }

    if (stats.isFile()) {
      const name = path.substring(path.lastIndexOf('/') + 1);
      const parentDirPath = path.substring(0, path.lastIndexOf('/'));
      const results = await this._scanFile(name, parentDirPath);

      return results ? results.toObject() : {};
    }
  }

  /**
   * @param {String} path
   * @param {Array<Object>} results array containing all scan results
   */
  async _scanDirectory(path, results = {}) {
    const dirEntries = await Filesystem.getDirectoryEntries(path, true);

    for (const entry of dirEntries) {
      const entryPath = `${path}/${entry.name}`;

      if (entry.isDirectory()) {
        const isDirectoryExcluded = this._config.getExcludedDirectories().includes(entry.name);
        if (isDirectoryExcluded) {
          continue;
        }

        await this._scanDirectory(entryPath, results);
      }

      if (entry.isFile()) {
        const scannedFile = await this._scanFile(entry.name, path)
          .catch(() => null);
        if (scannedFile && scannedFile.hasKeys()) {
          results[entryPath] = scannedFile.toObject();
        }
      }
    }

    return results;
  }

  async _scanFile(name, path) {
    const isFileExcluded = this._config.getExcludedFiles().includes(name);
    if (isFileExcluded) {
      return Promise.reject();
    }

    const fullPath = `${path}/${name}`;
    const fileStats = await Filesystem.getFileStats(fullPath);
    const fileSize = fileStats.size;
    const fileSizeInMiB = (fileSize / oneMebibyte);
    if (fileSizeInMiB > this._config.getMaxFileSizeMiB()) {
      return Promise.reject();
    }

    const file = new File(name, path, fileSize);
    const fileExt = file.extension();
    const isExtensionWhitelisted = this._config.getIncludedFileExts().includes(fileExt);
    const isExtensionBlacklisted = this._config.getExcludedFileExts().includes(fileExt);
    if (!isExtensionWhitelisted && isExtensionBlacklisted) {
      return Promise.reject();
    }

    return Radar._scanFileForKeys(file);
  }

  /**
   * @param {File} file
   */
  static async _scanFileForKeys(file) {
    const scannedFile = new ScannedFile(file);
    return Filesystem.readFile(scannedFile, Radar._onLineRead)
      .catch(() => new ScannedFile(file));
  }

  /**
   * @param {ScannedFile} scannedFile
   * @param {String} line
   * @param {Number} lineNumber
   */
  static _onLineRead(scannedFile, line, lineNumber) {
    const keys = Scanner.findKeys(line);
    if (keys.length === 0) {
      return;
    }

    for (const key of keys) {
      const { term, confidence } = key;
      scannedFile.addKey(new Key(term, lineNumber, confidence));
    }
  }
}

module.exports = Radar;
