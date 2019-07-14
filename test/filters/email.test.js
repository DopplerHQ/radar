const Filter = require('../../src/filters/email');

test('valid email', () => {
  expect(Filter.checkMatch("test@test.test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("123test123@test.test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test@test.test.test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test.test@test.test.test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test+test@test.test.test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test.test+test@test.test.test")).toHaveProperty("score", 1);
});

test('invalid email', () => {
  expect(Filter.checkMatch("test@test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("@test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("@test.test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("@test.test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("testtest@test")).toHaveProperty("score", 0);
});
