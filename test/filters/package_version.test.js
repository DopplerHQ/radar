const Filter = require('../../src/filters/package_version');

test('version', () => {
  expect(Filter.checkMatch("@passify/xsd-schema-validator@0.7.1")).toBe(true);
  expect(Filter.checkMatch("@passify/xsd-schema-validator@^0.7.1")).toBe(true);
  expect(Filter.checkMatch("validate-npm-package-license@3.0.4")).toBe(true);
});

test('not package version', () => {
  expect(Filter.checkMatch("version-0.7.1")).toBe(false);
  expect(Filter.checkMatch("randomtext")).toBe(false);
});
