const Filter = require('../../src/filters/authurl');

test('is auth url', () => {
  expect(Filter.checkMatch("https://user:pass@google.com")).toBe(true);
  expect(Filter.checkMatch("https://user:pass@google.com/")).toBe(true);
  expect(Filter.checkMatch("http://user:pass@google.com")).toBe(true);
  expect(Filter.checkMatch("//user:pass@google.com")).toBe(true);
  expect(Filter.checkMatch("mongodb://${USER}:${PASSWORD}@localhost/${APP_NAME}")).toBe(true);
  expect(Filter.checkMatch("postgres://${USER}:${PASSWORD}@anton.local:5432/${APP_NAME}")).toBe(true);
  expect(Filter.checkMatch("http://user:pass@")).toBe(true);
});

test('is not auth url', () => {
  expect(Filter.checkMatch("https://registry.npmjs.org/@babel/polyfill/")).toBe(false);
  expect(Filter.checkMatch("//registry.npmjs.org/@babel/polyfill/")).toBe(false);
  expect(Filter.checkMatch("git+ssh://git@github.com/dopplerhq/radar")).toBe(false);
  expect(Filter.checkMatch("https://google.com")).toBe(false);
  expect(Filter.checkMatch("google.com")).toBe(false);
  expect(Filter.checkMatch("https://user@google.com")).toBe(false);
  expect(Filter.checkMatch("user:pass@google.com")).toBe(false);
  expect(Filter.checkMatch("random text")).toBe(false);
});
