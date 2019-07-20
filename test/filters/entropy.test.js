const Filter = require('../../src/filters/entropy');

test('entropy calculation', () => {
  expect(Filter._calculateEntropy("1223334444")).toStrictEqual(1.8464393446710154);
  expect(Filter._calculateEntropy("0123")).toStrictEqual(2);
  expect(Filter._calculateEntropy("0123456789abc")).toStrictEqual(3.7004397181410926);
  expect(Filter._calculateEntropy("0123456789abcdef")).toStrictEqual(4);
  expect(Filter._calculateEntropy("0123456789abcdefghijklmnopqrst")).toStrictEqual(4.906890595608519);
  expect(Filter._calculateEntropy("0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=")).toStrictEqual(5.643856189774728);
  expect(Filter._calculateEntropy("123456d781fdf0dfdf323434cvfdfgyddfa23gs")).toStrictEqual(3.63354620892455);
  expect(Filter._calculateEntropy("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toStrictEqual(4.307406652054597);
  expect(Filter._calculateEntropy(".substring(6)")).toStrictEqual(3.5465935642949384);
});

test('entropy above minimum', () => {
  expect(Filter.checkMatch("1223334444")).toBe(false);
  expect(Filter.checkMatch("0123")).toBe(false);
  expect(Filter.checkMatch("0123456789abc")).toBe(false);
  expect(Filter.checkMatch("0123456789abcdef")).toBe(true);
  expect(Filter.checkMatch("0123456789abcdefghijklmnopqrst")).toBe(true);
  expect(Filter.checkMatch("0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=")).toBe(true);

  // TODO add a bunch of api keys with a range of entropy scores as a good test
  // use findings from radar-tester-big
});
