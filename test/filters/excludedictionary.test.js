const { checkMatch } = require('../../src/filters/excludedictionary');

test('mixed case', () => {
  expect(checkMatch("test Hello")).toHaveProperty("score", 0);
  expect(checkMatch("hey There Hello")).toHaveProperty("score", 0);
  expect(checkMatch("test test test")).toHaveProperty("score", 0);
  expect(checkMatch("test lsdjfoasdfosdhf")).toHaveProperty("score", 0);

  expect(checkMatch("randomgarbage")).toHaveProperty("score", 1);
  expect(checkMatch("fooz barz")).toHaveProperty("score", 1);
  expect(checkMatch("test randomgarbage rndmgrbg")).toHaveProperty("score", 1);
});

test('camel case', () => {
  expect(checkMatch("randomGarbage")).toHaveProperty("score", 0);
  expect(checkMatch("wordNotword")).toHaveProperty("score", 0);
  expect(checkMatch("thisIsForTestingPurposes")).toHaveProperty("score", 0);
  expect(checkMatch("notwordAlsonotword")).toHaveProperty("score", 1);
});

test('symbols', () => {
  expect(checkMatch("case-sensitive")).toHaveProperty("score", 0);
  expect(checkMatch("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toHaveProperty("score", 0);
});

test('custom dictionary', () => {
  expect(checkMatch("polyfill")).toHaveProperty("score", 0);
  expect(checkMatch("Polyfill")).toHaveProperty("score", 0);
  expect(checkMatch("AWS")).toHaveProperty("score", 0);
  expect(checkMatch("PolyfillAWS")).toHaveProperty("score", 0);
});

test('numbers', () => {
  expect(checkMatch("404")).toHaveProperty("score", 0);
  expect(checkMatch("mp4")).toHaveProperty("score", 0);
});
