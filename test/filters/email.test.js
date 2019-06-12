const { checkMatch } = require('../../src/filters/email');

test('valid email', () => {
  expect(checkMatch("test@test.test")).toBe(1);
  expect(checkMatch("123test123@test.test")).toBe(1);
  expect(checkMatch("test@test.test.test")).toBe(1);
  expect(checkMatch("test.test@test.test.test")).toBe(1);
  expect(checkMatch("test+test@test.test.test")).toBe(1);
  expect(checkMatch("test.test+test@test.test.test")).toBe(1);
});

test('invalid email', () => {
  expect(checkMatch("test@test")).toBe(0);
  expect(checkMatch("@test")).toBe(0);
  expect(checkMatch("@test.test")).toBe(0);
  expect(checkMatch("@test.test")).toBe(0);
  expect(checkMatch("testtest@test")).toBe(0);
});
