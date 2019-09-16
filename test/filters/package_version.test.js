const Filter = require('../../src/filters/package_version');

test('version', () => {
  expect(Filter.isMatch("@passify/xsd-schema-validator@0.7.1")).toBe(true);
  expect(Filter.isMatch("@passify/xsd-schema-validator@^0.7.1")).toBe(true);
  expect(Filter.isMatch("validate-npm-package-license@3.0.4")).toBe(true);
  expect(Filter.isMatch("com.unboundid:unboundid-ldapsdk:4.0.8")).toBe(true);
  expect(Filter.isMatch("circleci/clojure:openjdk-11-lein-2.8.1")).toBe(true);
  expect(Filter.isMatch("org.bouncycastle:bcprov-jdk15on:1.59")).toBe(true);
  expect(Filter.isMatch("quay.io/k8scsi/csi-snapshotter:v1.2.0")).toBe(true);
  expect(Filter.isMatch("quay.io/k8scsi/hostpathplugin:v0.4.1")).toBe(true);
  expect(Filter.isMatch("quay.io/k8scsi/hostpathplugin:v1.2.0-rc3")).toBe(true);

  expect(Filter.isMatch("docker.elastic.co/elasticsearch/elasticsearch:5.6.12")).toBe(true);
  expect(Filter.isMatch("@babel/plugin-syntax-object-rest-spread@7.2.0")).toBe(true);
  expect(Filter.isMatch("babel-plugin-transform-strict-mode@^6.24.1")).toBe(true);
  expect(Filter.isMatch("babel-plugin-transform-strict-mode@6.24.1")).toBe(true);
  expect(Filter.isMatch("object.getownpropertydescriptors@2.0.3")).toBe(true);
  expect(Filter.isMatch("arn:aws:dynamodb:us-west-2:111122223333:table/Forum/stream/2015-05-20T20:51:10.252")).toBe(true);
  expect(Filter.isMatch("userAccountControl:1.2.840.113556.1.4.803")).toBe(true);
  expect(Filter.isMatch("node-12.x-yarn-1.16-postgresql-9.6-graphicsmagick-1.3.33")).toBe(true);
  expect(Filter.isMatch("dev.gitlab.org:5005/gitlab/gitlab-build-images:ruby-2.6.3-git-2.22-chrome-73.0-node-12.x-yarn-1.16-graphicsmagick-1.3.33-docker-18.06.1")).toBe(true);
});

test('not package version', () => {
  expect(Filter.isMatch("randomtext")).toBe(false);
  expect(Filter.isMatch("version-0.7.1")).toBe(false);
  expect(Filter.isMatch("git@192.168.64.1:gitlab-org/gitlab-test.git")).toBe(false);
  expect(Filter.isMatch("pg://postgres@127.0.0.1:5432/postgres")).toBe(false);
  expect(Filter.isMatch("")).toBe(false);
});
