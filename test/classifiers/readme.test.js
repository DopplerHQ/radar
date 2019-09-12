const Classifier = require('../../src/classifiers/readme');
const File = require('../../src/objects/file');

test("is match", () => {
  expect(Classifier.isMatch(new File("readme"))).toBe(true);
  expect(Classifier.isMatch(new File("readme.md"))).toBe(true);
  expect(Classifier.isMatch(new File("README"))).toBe(true);
  expect(Classifier.isMatch(new File("README.MD"))).toBe(true);
});

test("is not match", () => {
  expect(Classifier.isMatch(new File("readme.md.test"))).toBe(false);
});
