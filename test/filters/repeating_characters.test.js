const Filter = require('../../src/filters/repeating_characters');

test('equals sign', () => {
  expect(Filter.isMatch("=test=test=")).toBe(true);

  expect(Filter.isMatch("=testtest==")).toBe(false);
  expect(Filter.isMatch("1 === 1")).toBe(false);
  expect(Filter.isMatch("1 == 1")).toBe(false);
});

test('backslash', () => {
  expect(Filter.isMatch("\\test\\test\\test\\test")).toBe(true);

  expect(Filter.isMatch("\\test\\test\\test")).toBe(false);
});

test('pipe', () => {
  expect(Filter.isMatch("test|test|test|test|test")).toBe(true);

  expect(Filter.isMatch("test|test|test|test")).toBe(false);
});

test('comma', () => {
  expect(Filter.isMatch("test,test,test,test,test")).toBe(true);

  expect(Filter.isMatch("test,test,test,test")).toBe(false);
});

test('brackets', () => {
  expect(Filter.isMatch("[test][test]")).toBe(true);
  expect(Filter.isMatch("[][]")).toBe(true);
  expect(Filter.isMatch("[0][0]")).toBe(true);

  expect(Filter.isMatch("[test]")).toBe(false);
});

test('parentheses', () => {
  expect(Filter.isMatch("(test)(test)")).toBe(true);
  expect(Filter.isMatch("()()")).toBe(true);
  expect(Filter.isMatch("(0)(0)")).toBe(true);

  expect(Filter.isMatch("(test)")).toBe(false);
});

test('double underscore', () => {
  expect(Filter.isMatch("__test")).toBe(true);

  expect(Filter.isMatch("_test")).toBe(false);
  expect(Filter.isMatch("_test_")).toBe(false);
  expect(Filter.isMatch("__123")).toBe(false);
});
