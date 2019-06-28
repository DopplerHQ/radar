const { checkMatch } = require('../../src/filters/excludeurl');

test('Is URL', () => {
  expect(checkMatch("https://example.com")).toStrictEqual(0);
  expect(checkMatch("https://subdomain.example.com/")).toStrictEqual(0);
  expect(checkMatch("https://example.com/test/index.html")).toStrictEqual(0);
});

test('Is not URL', () => {
  expect(checkMatch("https://user:pass@example.com")).toStrictEqual(1);
});
