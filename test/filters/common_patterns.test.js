const Filter = require('../../src/filters/common_patterns');

test("chained variables", () => {
  expect(Filter.isMatch("foo.bar.method")).toBe(true);
  expect(Filter.isMatch("foo::bar::method")).toBe(true);
  expect(Filter.isMatch("foo1.bar1.method1")).toBe(true);
  expect(Filter.isMatch("foo1::bar1::method1")).toBe(true);

  expect(Filter.isMatch("foo_bar_method")).toBe(false);
  expect(Filter.isMatch("foo-bar-method")).toBe(false);
  expect(Filter.isMatch("foo1_bar1_method1")).toBe(false);
  expect(Filter.isMatch("foo1-bar1-method1")).toBe(false);

  expect(Filter.isMatch("foo.bar")).toBe(false);
  expect(Filter.isMatch("foo::bar")).toBe(false);
});

test("chained variables w/ function call", () => {
  expect(Filter.isMatch("mshadow::Copy(recv_buf.aux_data(kIdx).FlatTo1D<cpu,")).toBe(true);
  expect(Filter.isMatch("mxnet::kvstore::Postprocess(&result1,")).toBe(true);
  expect(Filter.isMatch("mxnet::op::mxnet_op::Kernel<dequantize_2bit,w")).toBe(true);
  expect(Filter.isMatch("mxnet::op::batchnorm::BNTensor3<DType>")).toBe(true);
  expect(Filter.isMatch("nd.aux_data(rowsparse::kIdx).FlatTo1D<cpu,mx.initializer.Xavier(magnitude=2.57)")).toBe(true);
  expect(Filter.isMatch(`zookeeper::URL::parse("zk://jake:1@host1:port1,host2:port2/path/to/znode");`)).toBe(true);
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

test("variable parentheses", () => {
  expect(Filter.isMatch("$(variable)")).toBe(true);
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

test("group of alphanumerics", () => {
  expect(Filter.isMatch("ABKAVQF-RUO4CYO-FSC2VIP-VRX4QDA-TQQRN2J-MRDXJUC-FXNWP6N-S6ZSAAR")).toBe(true);

  expect(Filter.isMatch("ABKAVQF-RUO4CYO-FSC2VIP-VRX4QDA-TQQRN2J-MRDXJUC-FXNWP6N")).toBe(false);
});
