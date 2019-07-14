const Filter = require('../../src/filters/excludedictionary');

test('mixed case', () => {
  expect(Filter.checkMatch("test Hello")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("hey There Hello")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("test test test")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("test lsdjfoasdfosdhf")).toHaveProperty("score", 0);

  expect(Filter.checkMatch("randomgarbage")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("fooz barz")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test randomgarbage rndmgrbg")).toHaveProperty("score", 1);
});

test('camel case', () => {
  expect(Filter.checkMatch("randomGarbage")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("wordNotword")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("thisIsForTestingPurposes")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("notwordAlsonotword")).toHaveProperty("score", 1);
});

test('symbols', () => {
  expect(Filter.checkMatch("case-sensitive")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toHaveProperty("score", 0);
});

test('custom dictionary', () => {
  expect(Filter.checkMatch("polyfill")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("Polyfill")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("AWS")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("PolyfillAWS")).toHaveProperty("score", 0);
});

test('numbers', () => {
  expect(Filter.checkMatch("404")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("mp4")).toHaveProperty("score", 0);
});
