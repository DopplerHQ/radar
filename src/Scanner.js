const fs = require('fs');
const path = require('path');

let secretTypesToIdentify = [];

class Scanner {
  /**
   *
   * @param {Array<String>} secretTypes
   */
  static init(secretTypes) {
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
   * @param {File} file
   * @returns {Array<{ secret: String, secretType: String}}>}
   */
  static findSecrets(line, file) {
    const secrets = [];
    secretTypesToIdentify.filter(secretType => secretType.shouldScan(file))
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
