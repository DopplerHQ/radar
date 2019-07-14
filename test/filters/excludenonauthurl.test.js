const Filter = require('../../src/filters/excludenonauthurl');

test('is url w/o auth', () => {
  expect(Filter.checkMatch("https://example.com")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("https://subdomain.example.com/")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("https://example.com/test/index.html")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("https://user@example.com")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("//user@example.com")).toHaveProperty("score", 0);
});

test('is url w/ auth', () => {
  expect(Filter.checkMatch("https://user:pass@example.com")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("//user:pass@example.com")).toHaveProperty("score", 1);
});

test('is not url', () => {
  expect(Filter.checkMatch("testtesttest")).toHaveProperty("score", 1);
});
