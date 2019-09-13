const globs = require('../globs');
const Filter = require('../objects/Filter');
const ExcludedFiletypes = require('../../config/excluded_filetypes');
const IncludedFiletypes = require('../../config/included_filetypes');

class FileName extends Filter {
  constructor() {
    super('File name');

    // match alphanumerics + periods at end of string, with up to one trailing non-alphanumeric character
    // also allow for line number/character number specifications in the formats `file.ext`, `file.ext(2)`, and `file.ext::1::2`
    this.findFileNameRegex = /([a-z0-9]+(?:\.[a-z0-9]+)+)(?:(?:\([0-9]+\))|(?::[0-9]+)*)\W?$/i;

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

    const findFileName = term.match(this.findFileNameRegex);
    if (findFileName === null) {
      return false;
    }

    const fileName = findFileName[1].toLowerCase();
    return globs.isMatch(fileName, this.fileExtensions)
  }
}

const filter = new FileName();
module.exports = filter;
