const { checkMatch } = require('../../src/filters/excludedictionary');

test('mixed case', () => {
  expect(checkMatch("test Hello")).toBe(0);
  expect(checkMatch("hey There Hello")).toBe(0);
  expect(checkMatch("test test test")).toBe(0);
  expect(checkMatch("test lsdjfoasdfosdhf")).toBe(0);

  expect(checkMatch("randomgarbage")).toBe(1);
  expect(checkMatch("foo barz")).toBe(1);
  expect(checkMatch("test randomgarbage rndmgrbg")).toBe(1);
});

test('camel case', () => {
  expect(checkMatch("randomGarbage")).toBe(0);
  expect(checkMatch("wordNotword")).toBe(0);
  expect(checkMatch("thisIsForTestingPurposes")).toBe(0);
  expect(checkMatch("notwordAlsonotword")).toBe(1);
});

test('numbers', () => {
  expect(checkMatch("another9test")).toBe(0);
  expect(checkMatch("9another test")).toBe(0);
  expect(checkMatch("9test")).toBe(0);

  expect(checkMatch("te9st")).toBe(1);
});

test('symbols', () => {
  expect(checkMatch("another-test")).toBe(0);
  expect(checkMatch("another_test")).toBe(0);
  expect(checkMatch("another'test")).toBe(0);
  expect(checkMatch("another\"test")).toBe(0);
  expect(checkMatch("another@test")).toBe(0);
  expect(checkMatch("another(test")).toBe(0);
  expect(checkMatch("another)test")).toBe(0);
  expect(checkMatch("another[test")).toBe(0);
  expect(checkMatch("another]test")).toBe(0);
  expect(checkMatch("another<test")).toBe(0);
  expect(checkMatch("another>test")).toBe(0);
  expect(checkMatch("another{test")).toBe(0);
  expect(checkMatch("another}test")).toBe(0);
  expect(checkMatch("another;test")).toBe(0);
  expect(checkMatch("another:test")).toBe(0);
  expect(checkMatch("another,test")).toBe(0);
  expect(checkMatch("another.test")).toBe(0);
  expect(checkMatch("another?test")).toBe(0);
  expect(checkMatch("another!test")).toBe(0);
  expect(checkMatch("another/test")).toBe(0);
  expect(checkMatch("another\\test")).toBe(0);
  expect(checkMatch("another-_@test")).toBe(0);
});
