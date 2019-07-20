const Filter = require('../../src/filters/awsresource');

test('AWS Resource', () => {
  expect(Filter.checkMatch('arn:aws:iam::123456789012:mfa/Juan')).toBe(true);
  expect(Filter.checkMatch('arn:aws:sns:us-west-2:123456789012:exampletopic')).toBe(true);
  expect(Filter.checkMatch('arn:aws:s3:::policytest1/*\\')).toBe(true);
  expect(Filter.checkMatch('arn:aws:batch:us-east-1:012345678910:job-queue/GPGPU')).toBe(true);
  expect(Filter.checkMatch('arn:aws:storagegateway:us-east-1:999999999:tape/AMZN01A2A4')).toBe(true);
  expect(Filter.checkMatch('arn:aws:sts::123456789012:federated-user/Bob')).toBe(true);
  expect(Filter.checkMatch('arn:aws:dms:us-east-arn:aws:dms:us-east-1:123456789012:endpoint:ZW5UAN6P4E77EC7YWHK4RZZ3BE')).toBe(true);
  expect(Filter.checkMatch('arn:aws:ecs:us-east-1:012345678910:task-definition/hello_world:6')).toBe(true);
});
