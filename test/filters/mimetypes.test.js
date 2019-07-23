const Filter = require('../../src/filters/mimetypes');

test('is mimetype', () => {
  expect(Filter.isMatch("   application/vnd.   ")).toBe(true);
  expect(Filter.isMatch("testapplication/vnd.test")).toBe(true);
  expect(Filter.isMatch("application/vnd.")).toBe(true);
  expect(Filter.isMatch("application/vnd.test")).toBe(true);
});

test('is not mimetype', () => {
  expect(Filter.isMatch("DOPPLER_API_KEY")).toBe(false);
});
