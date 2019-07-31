const Filter = require('../../src/filters/email');

test('mailto', () => {
  expect(Filter.isMatch("mailto:test@example.com")).toBe(true);
  expect(Filter.isMatch("mailto:emailaddress")).toBe(true);
});

test('domain TLDs', () => {
  expect(Filter.isMatch("test@example.com")).toBe(true);
  expect(Filter.isMatch("test@example.org")).toBe(true);
  expect(Filter.isMatch("test@example.net")).toBe(true);
  expect(Filter.isMatch("test@example.gov")).toBe(true);
  expect(Filter.isMatch("test@example.edu")).toBe(true);
  expect(Filter.isMatch("test@example.uk")).toBe(true);
  expect(Filter.isMatch("test@example.ru")).toBe(true);
});

test('is email', () => {
  expect(Filter.isMatch("test@example.com ")).toBe(true);
  expect(Filter.isMatch("test@example.coma")).toBe(false);
  expect(Filter.isMatch("test@example.con")).toBe(false);

  expect(Filter.isMatch("<test@users.noreply.github.com>")).toBe(true);
  expect(Filter.isMatch(">user999@mydomain.org</a></td>")).toBe(true);
});

test('multiple periods', () => {
  expect(Filter.isMatch("test@exa.mple.com")).toBe(true);
  expect(Filter.isMatch("te.st@example.com")).toBe(true);
  expect(Filter.isMatch("te.st@exa.mple.com")).toBe(true);
})

test('not email', () => {
  expect(Filter.isMatch("https://user:pass@google.com")).toBe(false);
  expect(Filter.isMatch("https://user@google.com")).toBe(false);
})
