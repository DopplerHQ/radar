const { checkMatch } = require('../../src/filters/excludenonauthurl');

test('is url w/o auth', () => {
  expect(checkMatch("https://example.com")).toStrictEqual(0);
  expect(checkMatch("https://subdomain.example.com/")).toStrictEqual(0);
  expect(checkMatch("https://example.com/test/index.html")).toStrictEqual(0);
  expect(checkMatch("https://user@example.com")).toStrictEqual(0);
  expect(checkMatch("//user@example.com")).toStrictEqual(0);
});

test('is url w/ auth', () => {
  expect(checkMatch("https://user:pass@example.com")).toStrictEqual(1);
  expect(checkMatch("//user:pass@example.com")).toStrictEqual(1);
});

test('is not url', () => {
  expect(checkMatch("testtesttest")).toStrictEqual(1);
});
