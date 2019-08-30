const Filter = require('../../src/filters/dictionary');

test('isMatch', () => {
  Filter.minimumMatchPercentage = ".33";
  expect(Filter.isMatch("word Notword Notword2")).toBe(true);
  expect(Filter.isMatch("word test Notword")).toBe(true);

  expect(Filter.isMatch("Notword Notword2 Notword3")).toBe(false);
});

test('mixed case', () => {
  expect(Filter._checkDictionary("test Hello")).toBe(1);
  expect(Filter._checkDictionary("hey There Hello")).toBe(1);
  expect(Filter._checkDictionary("test test test")).toBe(1);
  expect(Filter._checkDictionary("test lsdjfoasdfosdhf")).toBe(.5);
  expect(Filter._checkDictionary("STRIPE_API_KEY=123456d781fdf0dfdf323434cvfdfgyddf")).toBe(3/4);
  expect(Filter._checkDictionary("test randomgarbage rndmgrbg")).toBe(1/3);

  expect(Filter._checkDictionary("")).toBe(0);
  expect(Filter._checkDictionary("randomgarbage")).toBe(0);
  expect(Filter._checkDictionary("fooz barz")).toBe(0);
  expect(Filter._checkDictionary("te1st randomgarbage rndmgrbg")).toBe(0);
});

test('camel case', () => {
  expect(Filter._checkDictionary("randomGarbage")).toBe(1);
  expect(Filter._checkDictionary("wordNotword")).toBe(.5);
  expect(Filter._checkDictionary("thisIsForTestingPurposes")).toBe(1);
  expect(Filter._checkDictionary("notwordAlsonotword")).toBe(0);
});

test('symbols', () => {
  expect(Filter._checkDictionary("case-sensitive")).toBe(1);
  expect(Filter._checkDictionary("to-retrieve-a-list-of-the-handshakes-sent-to-an-account-1472510214747")).toBe(1);
  expect(Filter._checkDictionary("January February March April May June July August September October November December")).toBe(1);
  expect(Filter._checkDictionary("January_February_March_April_May_June_July_August_September_October_November_December")).toBe(1);
  expect(Filter._checkDictionary("another_'\"@()[]<>{};:,.?!/\\\^\`-test")).toBe(1);
  expect(Filter._checkDictionary("!__webpack_require__(225).ABV,")).toBe(2/3);
  expect(Filter._checkDictionary("(!base64Chars[buf[i]])")).toBe(1);
  expect(Filter._checkDictionary("!inline.isBase64Path(")).toBe(1);
  expect(Filter._checkDictionary("0}),e)c._$tooltip.css(")).toBe(1);
});

test('custom dictionary', () => {
  expect(Filter._checkDictionary("polyfill")).toBe(1);
  expect(Filter._checkDictionary("Polyfill")).toBe(1);
  expect(Filter._checkDictionary("AWS")).toBe(1);
  expect(Filter._checkDictionary("PolyfillAWS")).toBe(1);
  expect(Filter._checkDictionary("forge.test1.pkcs12.toPkcs12Asn1(")).toBe(.5);
  expect(Filter._checkDictionary("t_stringliteral_32cc480c4f0e15e5ce7060ec5e004886ed5a15831cba1ff1aa7cb787be55bb60")).toBe(.5);
});

test('numbers', () => {
  expect(Filter._checkDictionary("404")).toBe(1);
  expect(Filter._checkDictionary("mp4")).toBe(1);

  expect(Filter._splitIntoTerms("404 notword Notword2 Word")).toStrictEqual(["404", "notword", "notword2", "word"]);
  expect(Filter._checkDictionary("404 notword Notword2 Word")).toBe(.5);

  expect(Filter._splitIntoTerms("4321 notword Notword2 Word")).toStrictEqual(["4321", "notword", "notword2", "word"]);
  expect(Filter._checkDictionary("4321 notword Notword2 Word")).toBe(1/3);
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
  expect(Filter._splitIntoTerms("completeHybiUpgrade1")).toStrictEqual(["complete", "hybi", "upgrade1"]);
  expect(Filter._splitIntoTerms("forge.test1.pkcs12.toPkcs12Asn1(")).toStrictEqual(["forge", "test1", "pkcs12", "pkcs12", "asn1"]);
});
