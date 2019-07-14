const { checkMatch } = require('../../src/filters/email');

test('valid email', () => {
  expect(checkMatch("test@test.test")).toHaveProperty("score", 1);
  expect(checkMatch("123test123@test.test")).toHaveProperty("score", 1);
  expect(checkMatch("test@test.test.test")).toHaveProperty("score", 1);
  expect(checkMatch("test.test@test.test.test")).toHaveProperty("score", 1);
  expect(checkMatch("test+test@test.test.test")).toHaveProperty("score", 1);
  expect(checkMatch("test.test+test@test.test.test")).toHaveProperty("score", 1);
});

test('invalid email', () => {
  expect(checkMatch("test@test")).toHaveProperty("score", 0);
  expect(checkMatch("@test")).toHaveProperty("score", 0);
  expect(checkMatch("@test.test")).toHaveProperty("score", 0);
  expect(checkMatch("@test.test")).toHaveProperty("score", 0);
  expect(checkMatch("testtest@test")).toHaveProperty("score", 0);
});
