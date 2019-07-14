const Filter = require('../../src/filters/authurl');

test('is auth url', () => {
  expect(Filter.checkMatch("https://user:pass@google.com")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("https://user:pass@google.com/")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("http://user:pass@google.com")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("//user:pass@google.com")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("mongodb://${USER}:${PASSWORD}@localhost/${APP_NAME}")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("postgres://${USER}:${PASSWORD}@anton.local:5432/${APP_NAME}")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("http://user:pass@")).toHaveProperty("score", 1);
});

test('is not auth url', () => {
  expect(Filter.checkMatch("https://registry.npmjs.org/@babel/polyfill/")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("//registry.npmjs.org/@babel/polyfill/")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("git+ssh://git@github.com/dopplerhq/radar")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("https://google.com")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("google.com")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("https://user@google.com")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("user:pass@google.com")).toHaveProperty("score", 0);
  expect(Filter.checkMatch("random text")).toHaveProperty("score", 0);
});
