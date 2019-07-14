const { checkMatch } = require('../../src/filters/excludenonauthurl');

test('is url w/o auth', () => {
  expect(checkMatch("https://example.com")).toHaveProperty("score", 0);
  expect(checkMatch("https://subdomain.example.com/")).toHaveProperty("score", 0);
  expect(checkMatch("https://example.com/test/index.html")).toHaveProperty("score", 0);
  expect(checkMatch("https://user@example.com")).toHaveProperty("score", 0);
  expect(checkMatch("//user@example.com")).toHaveProperty("score", 0);
});

test('is url w/ auth', () => {
  expect(checkMatch("https://user:pass@example.com")).toHaveProperty("score", 1);
  expect(checkMatch("//user:pass@example.com")).toHaveProperty("score", 1);
});

test('is not url', () => {
  expect(checkMatch("testtesttest")).toHaveProperty("score", 1);
});
