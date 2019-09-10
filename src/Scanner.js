const fs = require('fs');
const path = require('path');

const secretTypesPath = path.resolve(__dirname, 'secrets');
const filtersPath = path.resolve(__dirname, 'filters');

// the order of these indicate priority when de-duping
const SecretTypes = [
  "known_api_keys",
  "crypto_keys",
  "auth_urls",
  "api_keys",
  "env_variable",
];

class Scanner {
  /**
   *
   * @param {Array<string>} secretTypes
   */
  static loadSecretTypes(secretTypes) {
    return Scanner.listSecretTypes(secretTypes)
      .map(name => ({
        name,
        secretType: require(path.join(secretTypesPath, `${name}.js`)),
      }));
  }

  /**
   * Get a list of all secret types that radar can scan for
   * @param {Array<string>} secretTypesToUse secret types to allow. defaults to allowing all if blank
   */
  static listSecretTypes(secretTypesToUse = []) {
    if (secretTypesToUse.length === 0) {
      return SecretTypes;
    }

    return SecretTypes.filter(type => secretTypesToUse.includes(type));
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
   * @param {Array<{ name: string, secretType: Object }>} secretTypes order matters! secret types listed sooner take precedence when deduping
   * @param {string} line
   * @param {ScannedFile} scannedFile
   * @returns {Array<{ secret: string, secretType: string, metadata: Object }}>}
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

    return Scanner.dedupeSecrets(allSecrets);
  }

  /**
   * Remove secrets detected earlier by other secret types
   * @param {Object} secrets
   */
  static dedupeSecrets(secrets) {
    return secrets.filter((secret, i) => {
      if (i === 0) {
        return true;
      }

      for (i -= 1; i >= 0; i -= 1) {
        // NOTE this won't detect partially overlapping secrets (e.g. "0123" and "1234"). that's ok (and probably desired?)
        if (secrets[i].secret.includes(secret.secret)) {
          return false;
        }
      }
      return true;
    });
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
