const Filter = require('../../src/filters/authurl');

test('is auth url', () => {
  expect(Filter.isMatch("https://user:pass@google.com")).toBe(true);
  expect(Filter.isMatch("https://user:pass@google.com/")).toBe(true);
  expect(Filter.isMatch("http://user:pass@google.com")).toBe(true);
  expect(Filter.isMatch("//user:pass@google.com")).toBe(true);
  expect(Filter.isMatch("mongodb://${USER}:${PASSWORD}@localhost/${APP_NAME}")).toBe(true);
  expect(Filter.isMatch("postgres://${USER}:${PASSWORD}@anton.local:5432/${APP_NAME}")).toBe(true);
  expect(Filter.isMatch("http://user:pass@")).toBe(true);
  expect(Filter.isMatch("://t:t@,")).toBe(true);
});

test('is not auth url', () => {
  expect(Filter.isMatch("\"://:@\",")).toBe(false);
  expect(Filter.isMatch("\"://t:@\",")).toBe(false);
  expect(Filter.isMatch("\"://:t@\",")).toBe(false);

  expect(Filter.isMatch("https://registry.npmjs.org/@babel/polyfill/")).toBe(false);
  expect(Filter.isMatch("//registry.npmjs.org/@babel/polyfill/")).toBe(false);
  expect(Filter.isMatch("git+ssh://git@github.com/dopplerhq/radar")).toBe(false);
  expect(Filter.isMatch("https://google.com")).toBe(false);
  expect(Filter.isMatch("google.com")).toBe(false);
  expect(Filter.isMatch("https://user@google.com")).toBe(false);
  expect(Filter.isMatch("user:pass@google.com")).toBe(false);
  expect(Filter.isMatch("random text")).toBe(false);
  expect(Filter.isMatch("https://example.com/.well-known/webfinger?resource=acct:alice@example.com")).toBe(false);
});
