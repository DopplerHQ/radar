const Filter = require('../../src/filters/common_patterns');

test("chained variables", () => {
  expect(Filter.isMatch("foo.bar.method")).toBe(true);
  expect(Filter.isMatch("foo::bar::method")).toBe(true);
  expect(Filter.isMatch("foo1.bar1.method1")).toBe(true);
  expect(Filter.isMatch("foo1::bar1::method1")).toBe(true);

  expect(Filter.isMatch("foo_bar_method")).toBe(true);
  expect(Filter.isMatch("foo-bar-method")).toBe(true);
  expect(Filter.isMatch("foo1_bar1_method1")).toBe(true);
  expect(Filter.isMatch("foo1-bar1-method1")).toBe(true);
});

test("feature flag", () => {
  expect(Filter.isMatch("--disable=true")).toBe(true);
  expect(Filter.isMatch("--disable=one,two")).toBe(true);
  expect(Filter.isMatch("--disable-option=one,two")).toBe(true);
  expect(Filter.isMatch("--disable-option='one,two'")).toBe(true);
  expect(Filter.isMatch(`--disable-option="one,two"`)).toBe(true);
});

test("variable curly braces", () => {
  expect(Filter.isMatch("${variable}")).toBe(true);
  expect(Filter.isMatch("test${variable}test")).toBe(true);
  expect(Filter.isMatch("test#{variable}test")).toBe(true);
  expect(Filter.isMatch("test%{variable}test")).toBe(true);
});

test('variable with version', () => {
  expect(Filter.isMatch("mapreduce.input.fileinputformat.split.minsize=300")).toBe(true);
  expect(Filter.isMatch("io.prometheus:simpleclient_httpserver:0.3.0")).toBe(true);
  expect(Filter.isMatch("com.esotericsoftware.minlog:minlog:1")).toBe(true);
  expect(Filter.isMatch("com.esotericsoftware.minlog:minlog:1.2")).toBe(true);
  expect(Filter.isMatch("com.esotericsoftware.kryo:kryo:2.24.0")).toBe(true);

  expect(Filter.isMatch("aaa.bbb:1")).toBe(true);
  expect(Filter.isMatch("aaa.bbb:1.0.0")).toBe(true);
  expect(Filter.isMatch("aaa.bbb=1.0.0")).toBe(true);
  expect(Filter.isMatch("a_b.a_b=1.0.0")).toBe(true);
  expect(Filter.isMatch("a_b:a_b:1.0.0")).toBe(true);
})

test("array access", () => {
  expect(Filter.isMatch("test[0]")).toBe(true);
  expect(Filter.isMatch("test[1]")).toBe(true);
  expect(Filter.isMatch("test[1].test")).toBe(true);
});
