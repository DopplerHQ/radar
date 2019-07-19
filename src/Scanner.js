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

    secretTypesToIdentify.forEach(type => scanCache.set(type, new Map()));
  }

  /**
   *
   * @param {String} line
   * @param {File} file
   * @returns {Array<{ secret: String, secretType: String}}>}
   */
  static findSecrets(line, file) {
    const secrets = [];
    secretTypesToIdentify.filter((secretType) => {
      // TODO extract this logic to a separate function/class?
      const filePath = file.fullPath();
      const secretTypeName = secretType.name();
      const typeCache = scanCache.get(filePath);

      if (typeCache.has(secretTypeName)) {
        return typeCache.get(secretTypeName);
      }

      const shouldScanFile = secretType.shouldScan(file);
      typeCache.set(secretTypeName, shouldScanFile);
      return shouldScanFile;
    })
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
};

module.exports = Scanner;
