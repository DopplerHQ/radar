const util = require('../../src/cli/util');

test("parse string array", () => {
  expect(util.parseStringArray(undefined)).toStrictEqual([]);
  expect(util.parseStringArray("")).toStrictEqual([]);
  expect(util.parseStringArray(",")).toStrictEqual([]);
  expect(util.parseStringArray("one,two")).toStrictEqual(["one", "two"]);
  expect(util.parseStringArray("one, two")).toStrictEqual(["one", "two"]);
});

test("parse extension array", () => {
  expect(util.parseExtensionArray(undefined)).toStrictEqual([]);
  expect(util.parseExtensionArray("")).toStrictEqual([]);
  expect(util.parseExtensionArray("min.js,min.css")).toStrictEqual(["min.js", "min.css"]);
  expect(util.parseExtensionArray("min.js, min.css")).toStrictEqual(["min.js", "min.css"]);
  expect(util.parseExtensionArray(".min.js, .min.css")).toStrictEqual(["min.js", "min.css"]);
  expect(util.parseExtensionArray(".")).toStrictEqual([]);
  expect(util.parseExtensionArray(".,.")).toStrictEqual([]);
})

test("parse number", () => {
  expect(util.parseNumber(undefined)).toStrictEqual(undefined);
  expect(util.parseNumber("")).toStrictEqual(undefined);
  expect(util.parseNumber("123")).toStrictEqual(123);
  expect(util.parseNumber("abc")).toStrictEqual(undefined);
})
