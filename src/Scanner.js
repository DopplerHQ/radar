const fs = require('fs');
const path = require('path');

class Scanner {
  constructor() {
    this.secretTypesToIdentify = [];
  }
  /**
   *
   * @param {Array<String>} secretTypes
   */
  init(secretTypes) {
    const secretTypesPath = path.resolve(__dirname, 'secrets');
    this.secretTypesToIdentify = fs.readdirSync(secretTypesPath)
      .filter(file => {
        const fileName = file.substring(0, file.indexOf('.'));
        return ((secretTypes.length === 0) || secretTypes.includes(fileName))
      })
      .map(file => (file.endsWith('.js') ? require(`${secretTypesPath}/${file}`) : null))
      .filter(file => (file !== null));
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
