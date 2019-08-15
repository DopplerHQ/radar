const fs = require('fs');
const path = require('path');

class Scanner {
  constructor() {
    this.secretTypesToIdentify = [];
    this.secretTypesPath = path.resolve(__dirname, 'secrets');
    this.filtersPath = path.resolve(__dirname, 'filters');
  }
  /**
   *
   * @param {Array<String>} secretTypes
   */
  init(secretTypes) {
    this.secretTypesToIdentify = this.getSecretTypes(secretTypes)
      .map(file => require(path.join(this.secretTypesPath, file)));
  }

  /**
   * Get a list of all secret types that radar can scan for
   * @param {Array<String>} secretTypes secret types to allow. defaults to allowing all if blank
   */
  getSecretTypes(secretTypes = []) {
    return fs.readdirSync(this.secretTypesPath)
      .filter(file => {
        const fileName = file.substring(0, file.indexOf('.'));
        return ((secretTypes.length === 0) || secretTypes.includes(fileName));
      })
      .filter(file => file.endsWith('.js'));
  }

  /**
   * Get a list of all filters that radar can use
   */
  getFilters() {
    return fs.readdirSync(this.filtersPath)
      .filter(file => file.endsWith('.js'));
  }

  /**
   *
   * @param {String} line
   * @param {ScannedFile} scannedFile
   * @returns {Array<{ secret: String, secretType: String}}>}
   */
  findSecrets(line, scannedFile) {
    const allSecrets = [];
    this.secretTypesToIdentify.filter(secretType => this.shouldScanForSecretType(secretType, scannedFile))
      .map((secretType) => {
        const terms = secretType.getTerms(line);
        const { secrets, tags } = secretType.check(terms);

        if ((tags !== undefined) && (Object.keys(tags).length > 0)) {
          this.handleTags(tags, scannedFile);
        }

        return secrets.map(secret => ({
          secret,
          secretType: secretType.name(),
        }))
      })
      .forEach(s => allSecrets.push(...s));
    return allSecrets;
  }

  handleTags(tags, scannedFile) {
    Object.keys(tags).forEach((tag) => {
      const value = tags[tag];
      if (value === true) {
        scannedFile.addTag(tag);
      }
      else if (value === false) {
        scannedFile.deleteTag(tag);
      }
    })
  }

  /**
   *
   * @param {Secret} secretType
   * @param {ScannedFile} scannedFile
   * @returns {boolean}
   */
  shouldScanForSecretType(secretType, scannedFile) {
    return secretType.shouldScan(scannedFile.tags());
  }
};

module.exports = Scanner;
