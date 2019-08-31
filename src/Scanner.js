const fs = require('fs');
const path = require('path');

const secretTypesPath = path.resolve(__dirname, 'secrets');
const filtersPath = path.resolve(__dirname, 'filters');

class Scanner {
  /**
   *
   * @param {Array<string>} secretTypes
   */
  static loadSecretTypes(secretTypes) {
    return Scanner.getSecretTypes(secretTypes)
      .map(fileName => ({
        name: fileName.substring(0, fileName.indexOf('.')),
        secretType: require(path.join(secretTypesPath, fileName)),
      }));
  }

  /**
   * Get a list of all secret types that radar can scan for
   * @param {Array<string>} secretTypes secret types to allow. defaults to allowing all if blank
   */
  static getSecretTypes(secretTypes = []) {
    return fs.readdirSync(secretTypesPath)
      .filter(file => {
        const fileName = file.substring(0, file.indexOf('.'));
        return ((secretTypes.length === 0) || secretTypes.includes(fileName));
      })
      .filter(file => file.endsWith('.js'));
  }

  /**
   * Get a list of all filters that radar can use
   */
  static getFilters() {
    return fs.readdirSync(filtersPath)
      .filter(file => file.endsWith('.js'));
  }

  /**
   *
   * @param {Array<{ name: string, secretType: Object }}>} secretTypes
   * @param {string} line
   * @param {ScannedFile} scannedFile
   * @returns {Array<{ secret: string, secretType: string}}>}
   */
  static findSecrets(secretTypes, line, scannedFile) {
    const allSecrets = [];
    secretTypes.filter(({ secretType }) => Scanner.shouldScanForSecretType(secretType, scannedFile))
      .map(({ secretType }) => {
        const terms = secretType.getTerms(line);
        const { secrets, tags, metadata } = secretType.check(terms);

        if ((tags !== undefined) && (Object.keys(tags).length > 0)) {
          Scanner.handleTags(tags, scannedFile);
        }

        return secrets.map((secret, i) => ({
          secret,
          secretType: secretType.name(),
          metadata: {
            service: (metadata.services !== undefined) ? metadata.services[i] : undefined,
          },
        }))
      })
      .forEach(s => allSecrets.push(...s));
    return allSecrets;
  }

  static handleTags(tags, scannedFile) {
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
  static shouldScanForSecretType(secretType, scannedFile) {
    return secretType.shouldScan(scannedFile.tags());
  }
}

module.exports = Scanner;
