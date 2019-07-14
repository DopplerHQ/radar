const Filter = require('../../src/filters/excludepatterns');

test('Equals signs', () => {
  expect(Filter.checkMatch("test")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test=")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test==")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("test===")).toHaveProperty("score", 0);
});

test('Double colon separator', () => {
  expect(Filter.checkMatch("MyClass:MyFunction")).toHaveProperty("score", 1);
  expect(Filter.checkMatch(":MyClass:MyFunction:")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("MyClass:::MyFunction")).toHaveProperty("score", 1);
  expect(Filter.checkMatch("::MyFunction")).toHaveProperty("score", 1);

  expect(Filter.checkMatch("MyClass::MyFunction")).toHaveProperty("score", 0);
});
