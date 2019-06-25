const { checkMatch } = require('../../src/filters/email');

test('valid email', () => {
  expect(checkMatch("test@test.test")).toStrictEqual(1);
  expect(checkMatch("123test123@test.test")).toStrictEqual(1);
  expect(checkMatch("test@test.test.test")).toStrictEqual(1);
  expect(checkMatch("test.test@test.test.test")).toStrictEqual(1);
  expect(checkMatch("test+test@test.test.test")).toStrictEqual(1);
  expect(checkMatch("test.test+test@test.test.test")).toStrictEqual(1);
});

test('invalid email', () => {
  expect(checkMatch("test@test")).toStrictEqual(0);
  expect(checkMatch("@test")).toStrictEqual(0);
  expect(checkMatch("@test.test")).toStrictEqual(0);
  expect(checkMatch("@test.test")).toStrictEqual(0);
  expect(checkMatch("testtest@test")).toStrictEqual(0);
});
