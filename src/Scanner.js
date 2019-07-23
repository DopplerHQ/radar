const fs = require('fs');
const path = require('path');

const MapCache = require('./objects/mapcache');

let secretTypesToIdentify = [];
const scanCache = new MapCache();

class Scanner {
  /**
   *
   * @param {Array<String>} secretTypes
   */
  static init(secretTypes) {
    scanCache.clear();

    const secretTypesPath = path.resolve(__dirname, 'secrets');
    secretTypesToIdentify = fs.readdirSync(secretTypesPath)
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
  static findSecrets(line, scannedFile) {
    const secrets = [];
    secretTypesToIdentify.filter(secretType => Scanner.shouldScanForSecretType(secretType, scannedFile))
      .forEach((secretType) => {
        const terms = secretType.getTerms(line);
        secretType.check(terms)
          .forEach(secret => {
            secrets.push({
              secret,
              secretType: secretType.name(),
            });
          })
    });
    return secrets;
  }

  /**
   *
   * @param {Secret} secretType
   * @param {ScannedFile} scannedFile
   * @returns {boolean}
   */
  static shouldScanForSecretType(secretType, scannedFile) {
    const file = scannedFile.file();
    const filePath = file.fullPath();
    const secretTypeName = secretType.name();
    const typeCache = scanCache.get(filePath);

    if (typeCache.has(secretTypeName)) {
      return typeCache.get(secretTypeName);
    }

    const { shouldScan, shouldCache } = secretType.shouldScan(scannedFile);
    if (shouldCache){
      typeCache.set(secretTypeName, shouldScan);
    }

    return shouldScan;
  }
};

module.exports = Scanner;
