const { checkMatch } = require('../../src/filters/excludedictionary');

test('mixed case', () => {
  expect(checkMatch("test Hello")).toStrictEqual(0);
  expect(checkMatch("hey There Hello")).toStrictEqual(0);
  expect(checkMatch("test test test")).toStrictEqual(0);
  expect(checkMatch("test lsdjfoasdfosdhf")).toStrictEqual(0);

  expect(checkMatch("randomgarbage")).toStrictEqual(1);
  expect(checkMatch("fooz barz")).toStrictEqual(1);
  expect(checkMatch("test randomgarbage rndmgrbg")).toStrictEqual(1);
});

test('camel case', () => {
  expect(checkMatch("randomGarbage")).toStrictEqual(0);
  expect(checkMatch("wordNotword")).toStrictEqual(0);
  expect(checkMatch("thisIsForTestingPurposes")).toStrictEqual(0);
  expect(checkMatch("notwordAlsonotword")).toStrictEqual(1);
});

test('symbols', () => {
  expect(checkMatch("case-sensitive")).toStrictEqual(0);
  expect(checkMatch("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toStrictEqual(0);
});

test('custom dictionary', () => {
  expect(checkMatch("polyfill")).toStrictEqual(0);
  expect(checkMatch("Polyfill")).toStrictEqual(0);
  expect(checkMatch("AWS")).toStrictEqual(0);
  expect(checkMatch("PolyfillAWS")).toStrictEqual(0);
});

test('numbers', () => {
  expect(checkMatch("404")).toStrictEqual(0);
  expect(checkMatch("mp4")).toStrictEqual(0);
});
