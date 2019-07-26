const Filter = require('../../src/filters/date');

test('is date', () => {
  expect(Filter.isMatch("2014-06-30T19:07:47.885Z")).toBe(true);
});

test('is not date', () => {
  expect(Filter.isMatch("not a real date")).toBe(false);
});
