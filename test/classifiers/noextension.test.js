const Classifier = require('../../src/classifiers/no_extension');
const File = require('../../src/objects/file');

test("is match", () => {
  expect(Classifier.isMatch(new File("file"))).toBe(true);
});

test("is not match", () => {
  expect(Classifier.isMatch(new File("file.txt"))).toBe(false);
  expect(Classifier.isMatch(new File("file.txt.test"))).toBe(false);
});
