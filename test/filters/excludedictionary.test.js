const { checkMatch } = require('../../src/filters/excludedictionary');

test('mixed case', () => {
  expect(checkMatch("test Hello")).toStrictEqual(0);
  expect(checkMatch("hey There Hello")).toStrictEqual(0);
  expect(checkMatch("test test test")).toStrictEqual(0);
  expect(checkMatch("test lsdjfoasdfosdhf")).toStrictEqual(0);

  expect(checkMatch("randomgarbage")).toStrictEqual(1);
  expect(checkMatch("foo barz")).toStrictEqual(1);
  expect(checkMatch("test randomgarbage rndmgrbg")).toStrictEqual(1);
});

test('camel case', () => {
  expect(checkMatch("randomGarbage")).toStrictEqual(0);
  expect(checkMatch("wordNotword")).toStrictEqual(0);
  expect(checkMatch("thisIsForTestingPurposes")).toStrictEqual(0);
  expect(checkMatch("notwordAlsonotword")).toStrictEqual(1);
});

test('numbers', () => {
  expect(checkMatch("another9test")).toStrictEqual(0);
  expect(checkMatch("9another test")).toStrictEqual(0);
  expect(checkMatch("9test")).toStrictEqual(0);

  expect(checkMatch("te9st")).toStrictEqual(1);
});

test('symbols', () => {
  expect(checkMatch("another-test")).toStrictEqual(0);
  expect(checkMatch("another_test")).toStrictEqual(0);
  expect(checkMatch("another'test")).toStrictEqual(0);
  expect(checkMatch("another\"test")).toStrictEqual(0);
  expect(checkMatch("another@test")).toStrictEqual(0);
  expect(checkMatch("another(test")).toStrictEqual(0);
  expect(checkMatch("another)test")).toStrictEqual(0);
  expect(checkMatch("another[test")).toStrictEqual(0);
  expect(checkMatch("another]test")).toStrictEqual(0);
  expect(checkMatch("another<test")).toStrictEqual(0);
  expect(checkMatch("another>test")).toStrictEqual(0);
  expect(checkMatch("another{test")).toStrictEqual(0);
  expect(checkMatch("another}test")).toStrictEqual(0);
  expect(checkMatch("another;test")).toStrictEqual(0);
  expect(checkMatch("another:test")).toStrictEqual(0);
  expect(checkMatch("another,test")).toStrictEqual(0);
  expect(checkMatch("another.test")).toStrictEqual(0);
  expect(checkMatch("another?test")).toStrictEqual(0);
  expect(checkMatch("another!test")).toStrictEqual(0);
  expect(checkMatch("another/test")).toStrictEqual(0);
  expect(checkMatch("another\\test")).toStrictEqual(0);
  expect(checkMatch("another-_@test")).toStrictEqual(0);
});
