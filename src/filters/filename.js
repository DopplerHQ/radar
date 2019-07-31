const Filter = require('../objects/Filter');
const filetypes = require('../filetypes');
const CryptoKeyExtensions = require('../crypto_key_extensions');

class FileName extends Filter {
  constructor() {
    super('File name');


    const fileExtensions = new Set();
    const minFileExtensionLength = 2;
    Object.keys(filetypes).forEach((type) => {
      filetypes[type].forEach((fileExt) => {
        if (fileExt.length >= minFileExtensionLength) {
          fileExtensions.add(fileExt.toLowerCase());
        }
      });
    });
    Object.keys(CryptoKeyExtensions).forEach((type) => {
      CryptoKeyExtensions[type].forEach((fileExt) => {
        if (fileExt.length >= minFileExtensionLength) {
          fileExtensions.add(fileExt.toLowerCase());
        }
      });
    });

    this.fileExtensions = Array.from(fileExtensions);
  }

  isMatch(term) {
    if (!term.includes('.')) {
      return false;
    }

    const termLowerCase = term.toLowerCase();
    const termEndsWithFileExtension = this.fileExtensions.reduce((acc, extension) => (
      acc || termLowerCase.endsWith(`.${extension}`)
    ), false);
    return termEndsWithFileExtension;
  }
}

const filter = new FileName();
module.exports = filter;
