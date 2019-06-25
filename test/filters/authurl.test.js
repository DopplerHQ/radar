const { checkMatch } = require('../../src/filters/authurl');

test('is auth url', () => {
  expect(checkMatch("https://test:user@google.com")).toStrictEqual(1);
  expect(checkMatch("mongodb://${USER}@localhost/${APP_NAME}")).toStrictEqual(1);
  expect(checkMatch("postgres://${USER}@anton.local:5432/${APP_NAME}")).toStrictEqual(1);
});

test('is not auth url', () => {
  expect(checkMatch("https://google.com")).toStrictEqual(0);
  expect(checkMatch("google.com")).toStrictEqual(0);
  expect(checkMatch("test:user@google.com")).toStrictEqual(0);
  expect(checkMatch("random text")).toStrictEqual(0);
});
