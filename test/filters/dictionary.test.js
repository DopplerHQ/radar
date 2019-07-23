const Filter = require('../../src/filters/dictionary');

beforeAll(() => {
  Filter.minimumMatchPercentage = ".33";
});

test('mixed case', () => {
  expect(Filter.isMatch("test Hello")).toBe(true);
  expect(Filter.isMatch("hey There Hello")).toBe(true);
  expect(Filter.isMatch("test test test")).toBe(true);
  expect(Filter.isMatch("test lsdjfoasdfosdhf")).toBe(true);
  expect(Filter.isMatch("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toBe(true);
  expect(Filter.isMatch("test randomgarbage rndmgrbg")).toBe(true);

  expect(Filter.isMatch("randomgarbage")).toBe(false);
  expect(Filter.isMatch("fooz barz")).toBe(false);
  expect(Filter.isMatch("te1st randomgarbage rndmgrbg")).toBe(false);
});

test('camel case', () => {
  expect(Filter.isMatch("randomGarbage")).toBe(true);
  expect(Filter.isMatch("wordNotword")).toBe(true);
  expect(Filter.isMatch("thisIsForTestingPurposes")).toBe(true);
  expect(Filter.isMatch("notwordAlsonotword")).toBe(false);
});

test('symbols', () => {
  expect(Filter.isMatch("case-sensitive")).toBe(true);
  expect(Filter.isMatch("to-retrieve-a-list-of-the-handshakes-sent-to-an-account-1472510214747")).toBe(true);
  expect(Filter.isMatch("January February March April May June July August September October November December")).toBe(true);
  expect(Filter.isMatch("January_February_March_April_May_June_July_August_September_October_November_December")).toBe(true);
  expect(Filter.isMatch("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toBe(true);
  expect(Filter.isMatch("!__webpack_require__(225).ABV,")).toBe(true);
  expect(Filter.isMatch("(!base64Chars[buf[i]])")).toBe(true);
  expect(Filter.isMatch("!inline.isBase64Path(")).toBe(true);
  expect(Filter.isMatch("0}),e)c._$tooltip.css(")).toBe(true);
});

test('custom dictionary', () => {
  expect(Filter.isMatch("polyfill")).toBe(true);
  expect(Filter.isMatch("Polyfill")).toBe(true);
  expect(Filter.isMatch("AWS")).toBe(true);
  expect(Filter.isMatch("PolyfillAWS")).toBe(true);
});

test('numbers', () => {
  expect(Filter.isMatch("404")).toBe(true);
  expect(Filter.isMatch("mp4")).toBe(true);
});

test('split terms', () => {
  expect(Filter._splitIntoTerms("testWords")).toStrictEqual(["test", "words"]);
  expect(Filter._splitIntoTerms("testWORDS")).toStrictEqual(["test", "words"]);
  expect(Filter._splitIntoTerms("TEST_WORDS")).toStrictEqual(["test", "words"]);
  expect(Filter._splitIntoTerms("TESTwords")).toStrictEqual(["tes", "twords"]);
  expect(Filter._splitIntoTerms("test123Words")).toStrictEqual(["test123", "words"]);
  expect(Filter._splitIntoTerms("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toStrictEqual(["stripe", "api", "key", "123456d781fdf0dfdf323434cvfdfgyddf"]);
  expect(Filter._splitIntoTerms("to-retrieve-a-list-of-the-handshakes-sent-to-an-account-1472510214747")).toStrictEqual(["retrieve", "list", "the", "handshakes", "sent", "account", "1472510214747"]);
  expect(Filter._splitIntoTerms("January_February_March_April_May_June_July_August_September_October_November_December")).toStrictEqual(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]);
  expect(Filter._splitIntoTerms("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toStrictEqual(["another", "test"]);
  expect(Filter._splitIntoTerms("(!base64Chars[buf[i]])")).toStrictEqual(["base64", "chars", "buf"]);
  expect(Filter._splitIntoTerms("!inline.isBase64Path(")).toStrictEqual(["inline", "base64", "path"]);
  expect(Filter._splitIntoTerms("0}),e)c._$tooltip.css(")).toStrictEqual(["tooltip", "css"]);
});
