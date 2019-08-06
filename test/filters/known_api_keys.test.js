const Filter = require('../../src/filters/known_api_keys');

test('doppler api key', () => {
  expect(Filter.isMatch("dplr_a0aA9nri4wDvBPR7p5VuSUsZmXt0sLX0Wgv7EPy1")).toBe(true);
});

test('aws api key', () => {
  expect(Filter.isMatch("AKIAJCBLJXRPPC7Z7XYQ")).toBe(true);
  expect(Filter.isMatch("ASIAJCBLJXRPPC7Z7XYQ")).toBe(true);
});

test('mailgun api key', () => {
  expect(Filter.isMatch("key-bf816c120f5cd74d00dd3899a8c380a8")).toBe(true);
  expect(Filter.isMatch("5f3290914054a7b2030ed7ccc3b98e72-c50f4a19-c3e64fd6")).toBe(true);
});

test('sendgrid api key', () => {
  expect(Filter.isMatch("SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA")).toBe(true);
  expect(Filter.isMatch("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")).toBe(true);
});

test('slack api key', () => {
  expect(Filter.isMatch("xoxa-2-78etyfhs9gcsd-sdfffsdtwf")).toBe(true);
  expect(Filter.isMatch("xoxb-92whqaoufbiskdt34wsaf")).toBe(true);
  expect(Filter.isMatch("xoxp-3294wygiaohupifugiywefss")).toBe(true);
  expect(Filter.isMatch("xoxr-q876g9opaifhgu92-y3rowusaf")).toBe(true);
});

test('slack webhook', () => {
  expect(Filter.isMatch("https://hooks.slack.com/TFNIWJESFJ/BOJIFDFS/UYWEGRIOAIDSFHUDS")).toBe(true);
});

test('stripe api key', () => {
  expect(Filter.isMatch("sk_test_9Cdf8oLDtTCR29WfcUHjBVPB")).toBe(true);
  expect(Filter.isMatch("sk_live_9Cdf8oLDtTCR29WfcUHjBVPB")).toBe(true);
  expect(Filter.isMatch("whsec_testsecret")).toBe(true);
});

test('mailchimp api key', () => {
  expect(Filter.isMatch("e8dce5838970d83428c97c574c435b3d-us3")).toBe(true);
});

test('sqreen api key', () => {
  expect(Filter.isMatch("org_a718d8e1faf3b28eafcdb13a2ab573b2c252e3f7b23138916cfbeb2eef07")).toBe(true);
});

test('square api key', () => {
  expect(Filter.isMatch("EAAAEBo_Fc_fyf1jYjzeJZxyqvyIWaeYoqLz7_oz0adYT5Vo5ljR4M4REmOMlnz-")).toBe(true);
  expect(Filter.isMatch("EAAAECZHA9BKk87Lk_1GrqTHEd2zKC46Ol1bFBV6Nkt4cMV_ZngD7WknAK6-Wrov")).toBe(true);
  expect(Filter.isMatch("EAAAED6SBhFvyFL_JM8bs3o_d_AXsXnriQC8-J8hKzvAgAt8CDZUv0cR5b6DfMtf")).toBe(true);
});

test('asana api key', () => {
  expect(Filter.isMatch("0/cc0c5ef726096a8cf7c11ba53e596443")).toBe(true);
  expect(Filter.isMatch("0/47ed1b9ef4a32dd30bf4f18ab33cff35")).toBe(true);
});

test('not a key', () => {
  expect(Filter.isMatch()).toBe(false);
  expect(Filter.isMatch("")).toBe(false);
  expect(Filter.isMatch("test")).toBe(false);
})
