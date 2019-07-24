const Filter = require('../../src/filters/url');

test('is url', () => {
  expect(Filter.isMatch("https://doppler.com")).toBe(true);
  expect(Filter.isMatch("http://doppler.com")).toBe(true);
  expect(Filter.isMatch("mongodb://localhost:27017/myproject")).toBe(true);
  expect(Filter.isMatch("udp://10.100.100.100:5002")).toBe(true);
  expect(Filter.isMatch("irc://irc.freenode.net/jsdom")).toBe(true);
  expect(Filter.isMatch("tcp://0.0.0.0:2375")).toBe(true);
  expect(Filter.isMatch("amqp://localhost:31991")).toBe(true);
  expect(Filter.isMatch("mongodb://127.0.0.1/agenda")).toBe(true);
  expect(Filter.isMatch("coap://[1080:0:0:0:8:800:200C:417A]:61616/")).toBe(true);

  // this filter will also detect auth urls
  expect(Filter.isMatch("postgres://someuser:somepassword@somehost:381/somedatabase")).toBe(true);
});

test('is not url', () => {
  expect(Filter.isMatch("DOPPLER_API_KEY")).toBe(false);
  expect(Filter.isMatch("/root/test/directory")).toBe(false);
});

test('is markdown link', () => {
  expect(Filter.isMatch("[extglob](index.js#L36)")).toBe(true);
  expect(Filter.isMatch("[plugins](#plugins)")).toBe(true);
  expect(Filter.isMatch("[Changelog](CHANGELOG.md)")).toBe(true);
  expect(Filter.isMatch("[dist](dist/nimn.js)")).toBe(true);
  expect(Filter.isMatch("[Graylog2](#graylog2-transport)")).toBe(true);
});
