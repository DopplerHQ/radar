const Filter = require('../../src/filters/uuid');

test('valid uuid', () => {
  expect(Filter.isMatch("02de5095-2410-4d3a-ac1b-cc40234af68f")).toBe(true);
});
