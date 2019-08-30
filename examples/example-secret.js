const Secret = require('../src/Secret');
const FileTags = require('../src/objects/file_tags');

/**
 * This Secret Type identifies the word "example" in any files whose extension ends with "test"
 */
class ExampleSecret extends Secret {
  constructor() {
    const name = 'example_secret';
    // use the example-filter to find matches
    const filters = ['example-filter'];
    // only check files with the TEST_FILE tag. note this isn't a real file tag, but the classifier for it is in example-classifier.js
    const fileTags = [FileTags.TEST_FILE];

    super(name, { filters, fileTags });
  }
}

module.exports = ExampleSecret;
