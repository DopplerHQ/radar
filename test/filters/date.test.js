const Filter = require('../../src/filters/date');

test('is date', () => {
  expect(Filter.checkMatch("2014-06-30T19:07:47.885Z")).toBe(true);
});

test('is not date', () => {
  expect(Filter.checkMatch("not a real date")).toBe(false);
});
