const micromatch = require('micromatch');

const Filter = require('../objects/Filter');
const ExcludedFiletypes = require('../../config/excluded_filetypes');
const IncludedFiletypes = require('../../config/included_filetypes');

const MicroMatchOptions = { nocase: true };

class FileName extends Filter {
  constructor() {
    super('File name');

    // match alphanumerics + periods at end of string, with up to one trailing non-alphanumeric character
    // also allow for line number/character number specifications in the format `file.ext:1:2`
    this.fileExtensionWithLineNumberRegex = /([a-z0-9\.]+)(?:(?:\([0-9]+\))|(?::[0-9]+)*)\W?$/i;

    const fileExtensions = new Set();
    const minFileExtensionLength = 1;
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

    const endsWithExtension = term.match(this.fileExtensionWithLineNumberRegex);
    if (endsWithExtension === null) {
      return false;
    }

    const possibleFileExtension = endsWithExtension[1].toLowerCase();
    if (!possibleFileExtension.includes('.')) {
      return false;
    }

    return micromatch.isMatch(possibleFileExtension, this.fileExtensions, MicroMatchOptions)
  }
}

const filter = new FileName();
module.exports = filter;
