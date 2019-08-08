const Filter = require('../../src/filters/uri_encoding');

test('uri encoding', () => {
  expect(Filter.isMatch("")).toBe(false);
  expect(Filter.isMatch("test")).toBe(false);
  expect(Filter.isMatch("test%20")).toBe(false);
  expect(Filter.isMatch("test%20%20")).toBe(true);
  expect(Filter.isMatch("test%20%21")).toBe(true);
});
