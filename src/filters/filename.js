const Filter = require('../objects/Filter');
const ExcludedFiletypes = require('../excluded_filetypes');
const IncludedFiletypes = require('../included_filetypes');

class FileName extends Filter {
  constructor() {
    super('File name');


    const fileExtensions = new Set();
    const minFileExtensionLength = 2;
    Object.keys(ExcludedFiletypes).forEach((type) => {
      ExcludedFiletypes[type].forEach((fileExt) => {
        if (fileExt.length >= minFileExtensionLength) {
          fileExtensions.add(fileExt.toLowerCase());
        }
      });
    });
    Object.keys(IncludedFiletypes).forEach((type) => {
      IncludedFiletypes[type].forEach((fileExt) => {
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
