const Filter = require('../../src/filters/authurl');

test('is auth url', () => {
  expect(Filter.isMatch("//user:pass@google.com")).toBe(true);
  expect(Filter.isMatch("//user:pass@")).toBe(true);

  expect(Filter.isMatch("mongodb://${USER}:${PASSWORD}@localhost/${APP_NAME}")).toBe(true);
  expect(Filter.isMatch("postgres://${USER}:${PASSWORD}@anton.local:5432/${APP_NAME}")).toBe(true);
  expect(Filter.isMatch("otpauth://totp/local-part@domain?secret=thisisasecret&issuer=example.com")).toBe(true);
});

// TODO should this evaluate to true (w/o introducing false positives)
test('has domain but no protocol', () => {
  expect(Filter.isMatch("bob:pass@www.gravatar.com:8080")).toBe(false);
});

test('is not auth url', () => {
  expect(Filter.isMatch("://:@")).toBe(false);
  expect(Filter.isMatch("http://127.0.0.1:#{@port}")).toBe(false);

  expect(Filter.isMatch("https://registry.npmjs.org/@babel/polyfill/")).toBe(false);
  expect(Filter.isMatch("//registry.npmjs.org/@babel/polyfill/")).toBe(false);
  expect(Filter.isMatch("git+ssh://git@github.com/dopplerhq/radar")).toBe(false);
  expect(Filter.isMatch("https://google.com")).toBe(false);
  expect(Filter.isMatch("google.com")).toBe(false);
  expect(Filter.isMatch("https://user@google.com")).toBe(false);
  expect(Filter.isMatch("user:pass@google.com")).toBe(false);
  expect(Filter.isMatch(`StringValue("http://some-uri.com/that/is/a/common/prefix/to/all(((cmNH\`0R)H<tnLa:/;Q,igWY2EdwW^W7T3H6NMRoqR[O2TqQ@SbGKc(:0XOXq-5]ndm-R8?=,o?AW+9Pi_v4eON=Mpje7N4n*-nhFWKn>Sn0cGMlnDquY@-F:QY@-UZ.-//*OL*8\\SIpiZa)tefalZ99-P_-WFIaKPeGbkQ^iRgd,YYkn7:jBAW::PqAYtgl73dTaJ2CIT:11HJ70<ATOXZ]c6b_7EgQU,@uq+SMa=7Z]kg/OZ>TGduw>D7Lu[nEj_l=Ucwo5BQtBESh/4V>N9nj/pDLw[NM)a=ac6R-(FM2U+dwROMUH;);Y=")};`)).toBe(false);

  expect(Filter.isMatch("random text")).toBe(false);
});
