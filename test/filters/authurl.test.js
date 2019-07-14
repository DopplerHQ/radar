const { checkMatch } = require('../../src/filters/authurl');

test('is auth url', () => {
  expect(checkMatch("https://user:pass@google.com")).toHaveProperty("score", 1);
  expect(checkMatch("https://user:pass@google.com/")).toHaveProperty("score", 1);
  expect(checkMatch("http://user:pass@google.com")).toHaveProperty("score", 1);
  expect(checkMatch("//user:pass@google.com")).toHaveProperty("score", 1);
  expect(checkMatch("mongodb://${USER}:${PASSWORD}@localhost/${APP_NAME}")).toHaveProperty("score", 1);
  expect(checkMatch("postgres://${USER}:${PASSWORD}@anton.local:5432/${APP_NAME}")).toHaveProperty("score", 1);
  expect(checkMatch("http://user:pass@")).toHaveProperty("score", 1);
});

test('is not auth url', () => {
  expect(checkMatch("https://registry.npmjs.org/@babel/polyfill/")).toHaveProperty("score", 0);
  expect(checkMatch("//registry.npmjs.org/@babel/polyfill/")).toHaveProperty("score", 0);
  expect(checkMatch("git+ssh://git@github.com/dopplerhq/radar")).toHaveProperty("score", 0);
  expect(checkMatch("https://google.com")).toHaveProperty("score", 0);
  expect(checkMatch("google.com")).toHaveProperty("score", 0);
  expect(checkMatch("https://user@google.com")).toHaveProperty("score", 0);
  expect(checkMatch("user:pass@google.com")).toHaveProperty("score", 0);
  expect(checkMatch("random text")).toHaveProperty("score", 0);
});
