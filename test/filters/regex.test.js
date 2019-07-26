const Filter = require('../../src/filters/regex');

test('is regex', () => {
  expect(Filter.isMatch("([a-zA-Z]+)")).toBe(true);
  expect(Filter.isMatch("([a-z0-9]+)")).toBe(true);
  expect(Filter.isMatch("([A-Z0-9]+)")).toBe(true);
  expect(Filter.isMatch("([0-9A-Z]+)")).toBe(true);
  expect(Filter.isMatch("([a-zA-Z]+)")).toBe(true);
  expect(Filter.isMatch("([A-Za-z]+)")).toBe(true);
  expect(Filter.isMatch("([a-zA-Z0-9]+)")).toBe(true);
  expect(Filter.isMatch("a{2,}")).toBe(true);
  expect(Filter.isMatch("(a){2,}")).toBe(true);
  expect(Filter.isMatch("a{2,4}")).toBe(true);

  expect(Filter.isMatch(`/^[-+]0x[0-9a-f]+$/i`)).toBe(true);
  expect(Filter.isMatch(`^[a-zA-Z0-9+\\-_:\\/@]+$`)).toBe(true);
  expect(Filter.isMatch(`/(?!\d{1,4}\/\d{1,4}\s*-\s*\d{1,4}\/)(\d{1,4})\/(\d{1,4})\s*-\s*(\d{1,4})/g`)).toBe(true);
  expect(Filter.isMatch(`/^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/`)).toBe(true);
  expect(Filter.isMatch(`(\\d{2})(\\d{4})(\\d{4,7})`)).toBe(true);
  expect(Filter.isMatch(`/^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i`)).toBe(true);
  expect(Filter.isMatch(`/\d{1,2}(st|nd|rd|th)/,`)).toBe(true);
  expect(Filter.isMatch(`^[0-9][0-9a-f_,.-]*$`)).toBe(true);
  expect(Filter.isMatch(`^(?:ht|f)tps?:\/\/(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})`)).toBe(true);
});

test('is not regex', () => {
  expect(Filter.isMatch("DOPPLER_API_KEY")).toBe(false);
  expect(Filter.isMatch("")).toBe(false);
});
