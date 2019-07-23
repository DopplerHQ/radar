const Filter = require('../../src/filters/email');

test('valid email', () => {
  expect(Filter.isMatch("test@test.test")).toBe(true);
  expect(Filter.isMatch("123test123@test.test")).toBe(true);
  expect(Filter.isMatch("test@test.test.test")).toBe(true);
  expect(Filter.isMatch("test.test@test.test.test")).toBe(true);
  expect(Filter.isMatch("test+test@test.test.test")).toBe(true);
  expect(Filter.isMatch("test.test+test@test.test.test")).toBe(true);
  expect(Filter.isMatch("mailto:emailaddress")).toBe(true);
});

test('invalid email', () => {
  expect(Filter.isMatch("test@test")).toBe(false);
  expect(Filter.isMatch("@test")).toBe(false);
  expect(Filter.isMatch("@test.test")).toBe(false);
  expect(Filter.isMatch("@test.test")).toBe(false);
  expect(Filter.isMatch("testtest@test")).toBe(false);
});
