const Filter = require('../../src/filters/email');

test('valid email', () => {
  expect(Filter.checkMatch("test@test.test")).toBe(true);
  expect(Filter.checkMatch("123test123@test.test")).toBe(true);
  expect(Filter.checkMatch("test@test.test.test")).toBe(true);
  expect(Filter.checkMatch("test.test@test.test.test")).toBe(true);
  expect(Filter.checkMatch("test+test@test.test.test")).toBe(true);
  expect(Filter.checkMatch("test.test+test@test.test.test")).toBe(true);
});

test('invalid email', () => {
  expect(Filter.checkMatch("test@test")).toBe(false);
  expect(Filter.checkMatch("@test")).toBe(false);
  expect(Filter.checkMatch("@test.test")).toBe(false);
  expect(Filter.checkMatch("@test.test")).toBe(false);
  expect(Filter.checkMatch("testtest@test")).toBe(false);
});
