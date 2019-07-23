const Filter = require('../../src/filters/package_version');

test('version', () => {
  expect(Filter.isMatch("@passify/xsd-schema-validator@0.7.1")).toBe(true);
  expect(Filter.isMatch("@passify/xsd-schema-validator@^0.7.1")).toBe(true);
  expect(Filter.isMatch("validate-npm-package-license@3.0.4")).toBe(true);
});

test('not package version', () => {
  expect(Filter.isMatch("version-0.7.1")).toBe(false);
  expect(Filter.isMatch("randomtext")).toBe(false);
});
