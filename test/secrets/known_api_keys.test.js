const Secret = require('../../src/secrets/known_api_keys');

const generateResponse = (secret, service) => ({
  secrets: [secret],
  metadata: {
    services: [service],
  },
})

test('doppler api key', () => {
  const service = "doppler";
  expect(Secret.check(["dplr_a0aA9nri4wDvBPR7p5VuSUsZmXt0sLX0Wgv7EPy1"])).toStrictEqual(generateResponse("dplr_a0aA9nri4wDvBPR7p5VuSUsZmXt0sLX0Wgv7EPy1", service));
});

test('aws api key', () => {
  const service = "aws";
  expect(Secret.check(["AKIAJCBLJXRPPC7Z7XYQ"])).toStrictEqual(generateResponse("AKIAJCBLJXRPPC7Z7XYQ", service));
  expect(Secret.check(["ASIAJCBLJXRPPC7Z7XYQ"])).toStrictEqual(generateResponse("ASIAJCBLJXRPPC7Z7XYQ", service));
});

test('mailgun api key', () => {
  const service = "mailgun";
  expect(Secret.check(["key-bf816c120f5cd74d00dd3899a8c380a8"])).toStrictEqual(generateResponse("key-bf816c120f5cd74d00dd3899a8c380a8", service));
});

test('sendgrid api key', () => {
  const service = "sendgrid";
  expect(Secret.check(["SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA"])).toStrictEqual(generateResponse("SG.mjhasdf3hQ46NBfgRqSf3tIMg.HfKdKxhQN8WlmbkkFJA", service));
  expect(Secret.check(["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"])).toStrictEqual(generateResponse("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", service));
});

test('slack api key', () => {
  const service = "slack";
  expect(Secret.check(["xoxa-2-78etyfhs9gcsd-sdfffsdtwf"])).toStrictEqual(generateResponse("xoxa-2-78etyfhs9gcsd-sdfffsdtwf", service));
  expect(Secret.check(["xoxb-92whqaoufbiskdt34wsaf"])).toStrictEqual(generateResponse("xoxb-92whqaoufbiskdt34wsaf", service));
  expect(Secret.check(["xoxp-3294wygiaohupifugiywefss"])).toStrictEqual(generateResponse("xoxp-3294wygiaohupifugiywefss", service));
  expect(Secret.check(["xoxr-q876g9opaifhgu92-y3rowusaf"])).toStrictEqual(generateResponse("xoxr-q876g9opaifhgu92-y3rowusaf", service));
});

test('slack webhook', () => {
  const service = "slack-webhook";
  expect(Secret.check(["https://hooks.slack.com/TFNIWJESFJ/BOJIFDFS/UYWEGRIOAIDSFHUDS"])).toStrictEqual(generateResponse("https://hooks.slack.com/TFNIWJESFJ/BOJIFDFS/UYWEGRIOAIDSFHUDS", service));
});

test('stripe api key', () => {
  const service = "stripe";
  expect(Secret.check(["sk_test_9Cdf8oLDtTCR29WfcUHjBVPB"])).toStrictEqual(generateResponse("sk_test_9Cdf8oLDtTCR29WfcUHjBVPB", service));
  expect(Secret.check(["sk_live_9Cdf8oLDtTCR29WfcUHjBVPB"])).toStrictEqual(generateResponse("sk_live_9Cdf8oLDtTCR29WfcUHjBVPB", service));
});

test('stripe webhook', () => {
  const service = "stripe-webhook";
  expect(Secret.check(["whsec_testsecret"])).toStrictEqual(generateResponse("whsec_testsecret", service));
});

test('mailchimp api key', () => {
  const service = "mailchimp";
  expect(Secret.check(["e8dce5838970d83428c97c574c435b3d-us3"])).toStrictEqual(generateResponse("e8dce5838970d83428c97c574c435b3d-us3", service));
  expect(Secret.check(["5f3290914054a7b2030ed7ccc3b98e72-c50f4a19-c3e64fd6"])).toStrictEqual(generateResponse("5f3290914054a7b2030ed7ccc3b98e72-c50f4a19-c3e64fd6", service));
});

test('sqreen api key', () => {
  const service = "sqreen";
  expect(Secret.check(["org_a718d8e1faf3b28eafcdb13a2ab573b2c252e3f7b23138916cfbeb2eef07"])).toStrictEqual(generateResponse("org_a718d8e1faf3b28eafcdb13a2ab573b2c252e3f7b23138916cfbeb2eef07", service));
});

test('square api key', () => {
  const service = "square";
  expect(Secret.check(["EAAAEBo_Fc_fyf1jYjzeJZxyqvyIWaeYoqLz7_oz0adYT5Vo5ljR4M4REmOMlnz-"])).toStrictEqual(generateResponse("EAAAEBo_Fc_fyf1jYjzeJZxyqvyIWaeYoqLz7_oz0adYT5Vo5ljR4M4REmOMlnz-", service));
  expect(Secret.check(["EAAAECZHA9BKk87Lk_1GrqTHEd2zKC46Ol1bFBV6Nkt4cMV_ZngD7WknAK6-Wrov"])).toStrictEqual(generateResponse("EAAAECZHA9BKk87Lk_1GrqTHEd2zKC46Ol1bFBV6Nkt4cMV_ZngD7WknAK6-Wrov", service));
  expect(Secret.check(["EAAAED6SBhFvyFL_JM8bs3o_d_AXsXnriQC8-J8hKzvAgAt8CDZUv0cR5b6DfMtf"])).toStrictEqual(generateResponse("EAAAED6SBhFvyFL_JM8bs3o_d_AXsXnriQC8-J8hKzvAgAt8CDZUv0cR5b6DfMtf", service));
});

test('asana api key', () => {
  const service = "asana";
  expect(Secret.check(["0/cc0c5ef726096a8cf7c11ba53e596443"])).toStrictEqual(generateResponse("0/cc0c5ef726096a8cf7c11ba53e596443", service));
  expect(Secret.check(["0/47ed1b9ef4a32dd30bf4f18ab33cff35"])).toStrictEqual(generateResponse("0/47ed1b9ef4a32dd30bf4f18ab33cff35", service));
});

test('not a key', () => {
  expect(Secret.check([""])).toStrictEqual({ secrets: [], metadata: {} });
  expect(Secret.check(["test"])).toStrictEqual({ secrets: [], metadata: {} });
})