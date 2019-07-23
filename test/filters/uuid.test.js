const Filter = require('../../src/filters/uuid');

test('valid uuid', () => {
  expect(Filter.isMatch("02de5095-2410-4d3a-ac1b-cc40234af68f")).toBe(true);
  expect(Filter.isMatch("2884C253-634B-4669-AE00-10CA72E817E7")).toBe(true);
});

test('invalid uuid', () => {
  expect(Filter.isMatch("02de509524104d3aac1bcc40234af68f")).toBe(false);
});
