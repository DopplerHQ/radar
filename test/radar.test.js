const Radar = require('../src/radar');
const File = require('../src/objects/file');
const ScannedFile = require('../src/objects/scannedfile');

test("file exclusion- all possible states", () => {
  // no white/blacklist
  let config = {};
  let radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "goodext")).toBe(true);

  // whitelisted name
  config = { includedFiles: ["badfile"] };
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "goodext")).toBe(true);

  // blacklisted name
  config = { excludedFiles: ["badfile"] };
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "goodext")).toBe(false);

  // whitelisted ext
  config = { includedFileExts: ["badext"] };
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(true);

  // blacklisted ext
  config = { excludedFileExts: ["badext"] };
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(false);

  // whitelisted name, blacklisted ext
  config = { excludedFileExts: ["badext"], includedFiles: ["goodfile"] };
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(true);

  // blacklisted name, whitelisted ext
  config = { excludedFiles: ["badfile"], includedFileExts: ["badext"] };
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "badext")).toBe(false);

  // whitelisted name, whitelisted ext
  config = { includedFileExts: ["goodext"], includedFiles: ["goodfile"] };
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "goodext")).toBe(true);

  // whitelisted name, blacklisted name
  config = { excludedFiles: ["goodfile"], includedFiles: ["goodfile"] };
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "badext")).toBe(true);

  // whitelisted ext, blacklisted ext
  config = { includedFileExts: ["goodext"], excludedFileExts: ["goodext"] };
  radar = new Radar(config);
  expect(radar._checkFileName("goodfile", "goodext")).toBe(true);

  // blacklisted name, blacklisted ext
  config = { excludedFiles: ["badfile"], excludedFileExts: ["badext"] };
  radar = new Radar(config);
  expect(radar._checkFileName("badfile", "badext")).toBe(false);
});

test("filename exclusion", () => {
  let config = { excludedFiles: ["test/one/file.txt"] };
  const radar = new Radar(config);

  expect(radar._isNameBlacklisted("file.txt", "")).toBe(false);
  expect(radar._isNameBlacklisted("file.txt", "one/file.txt")).toBe(false);
  expect(radar._isNameBlacklisted("file.txt", "test/one/file.txt")).toBe(true);
  expect(radar._isNameBlacklisted("file.txt", "/test/one/file.txt")).toBe(false);
  expect(radar._isNameBlacklisted("file.txt", "another/test/one/file.txt")).toBe(false);
})

test("default file exclusions", () => {
  const radar = new Radar();
  // test default "package-lock.json" exclusion
  expect(radar._isNameBlacklisted("package-lock.json", "")).toBe(true);
  expect(radar._isNameBlacklisted("package-lock.json", "src/package-lock.json")).toBe(true);
  expect(radar._isNameBlacklisted("package-lock.json", "src/dir/package-lock.json")).toBe(true);
});

test("default directory exclusions", () => {
  const radar = new Radar();
  // test default "node_modules" exclusion
  expect(radar._isDirectoryBlacklisted("node_modules", "")).toBe(true);
  expect(radar._isDirectoryBlacklisted("node_modules", "src/node_modules")).toBe(true);
  expect(radar._isDirectoryBlacklisted("node_modules", "src/dir/node_modules")).toBe(true);

  // this dir shouldn't be explicitly excluded. rather, it'll never even be known about because its parent is excluded
  expect(radar._isDirectoryBlacklisted("test", "src/dir/node_modules/test")).toBe(false);
});

test("directory exclusion", () => {
  const config = { excludedDirectories: ["test/**/*"] };
  const radar = new Radar(config);

  expect(radar._isDirectoryBlacklisted("test", "test")).toBe(false);
  expect(radar._isDirectoryBlacklisted("file.txt", "test/file.txt")).toBe(true);
  expect(radar._isDirectoryBlacklisted("one", "test/one")).toBe(true);
  expect(radar._isDirectoryBlacklisted("two", "test/one/two")).toBe(true);
  expect(radar._isDirectoryBlacklisted("file.txt", "test/one/two/file.txt")).toBe(true);
  expect(radar._isDirectoryBlacklisted("file.txt", "/test/one/two/file.txt")).toBe(false);
  expect(radar._isDirectoryBlacklisted("file.txt", "another/test/one/two/file.txt")).toBe(false);
})

test("file extensions", () => {
  let radar = new Radar();
  expect(radar._isExtensionWhitelisted("badext")).toBe(false);
  expect(radar._isExtensionWhitelisted("badext.js")).toBe(false);
  expect(radar._isExtensionWhitelisted("js.badext")).toBe(false);

  expect(radar._isExtensionBlacklisted("badext")).toBe(false);
  expect(radar._isExtensionBlacklisted("badext.js")).toBe(false);
  expect(radar._isExtensionBlacklisted("js.badext")).toBe(false);

  const config = { excludedFileExts: ["badext"] };
  radar = new Radar(config);

  expect(radar._isExtensionWhitelisted("badext")).toBe(false);
  expect(radar._isExtensionWhitelisted("badext.js")).toBe(false);
  expect(radar._isExtensionWhitelisted("js.badext")).toBe(false);

  expect(radar._isExtensionBlacklisted("badext")).toBe(true);
  expect(radar._isExtensionBlacklisted("badext.js")).toBe(true);
  expect(radar._isExtensionBlacklisted("js.badext")).toBe(true);

  expect(radar._isExtensionBlacklisted("badext1")).toBe(false);
  expect(radar._isExtensionBlacklisted("badext1.js")).toBe(false);
  expect(radar._isExtensionBlacklisted("js.badext1")).toBe(false);
});

test("file exclusion- relative paths", () => {
  let config = { excludedFiles: ["nested/directory/testname.testext"] };
  let radar = new Radar(config);
  radar.basePath = "/root";
  expect(radar._checkFileName("testname", "testext", "nested/directory/testname.testext")).toBe(false);
  expect(radar._checkFileName("testname", "testext", "fake/nested/directory")).toBe(true);
  expect(radar._checkFileName("testname", "testext", "")).toBe(true);
});

test("directory exclusion - all possible states", () => {
  // no white/blacklist
  let config = {};
  let radar = new Radar(config);
  expect(radar._checkDirectory("gooddir")).toBe(true);

  // whitelisted
  config = { includedDirectories: ["gooddir"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("gooddir")).toBe(true);
  expect(radar._checkDirectory("test.gooddir")).toBe(true);

  // blacklisted
  config = { excludedDirectories: ["baddir"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(false);
  expect(radar._checkDirectory("test.baddir")).toBe(true);

  // whitelisted and blacklisted
  config = { includedDirectories: ["baddir"], excludedDirectories: ["baddir"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("baddir")).toBe(true);
});

test("directory exclusion- relative paths", () => {
  let config = { excludedDirectories: ["nested/directory/**/*"] };
  let radar = new Radar(config);
  radar.basePath = "/root";
  expect(radar._checkDirectory("directory", "nested/directory")).toBe(true);
  expect(radar._checkDirectory("subdir", "nested/directory/subdir")).toBe(false);
  expect(radar._checkDirectory("subdir3", "nested/directory/subdir1/subdir2/subdir3")).toBe(false);

  expect(radar._checkDirectory("test", "")).toBe(true);
  expect(radar._checkDirectory("test", "/")).toBe(true);

  // explicit inclusion overrides wildcard exclusion
  config = { includedDirectories: ["nested/directory/one"], excludedDirectories: ["nested/directory/**/*"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("one", "nested/directory/one")).toBe(true);
  expect(radar._checkDirectory("two", "nested/directory/two")).toBe(false);

  // wildcard inclusion also overrides explicit exclusion (inclusion always overrides exclusion)
  config = { includedDirectories: ["nested/directory/**/*"], excludedDirectories: ["nested/directory/two"] };
  radar = new Radar(config);
  expect(radar._checkDirectory("two", "nested/directory/two")).toBe(true);
});

test("file size exclusion", () => {
  // passing name, passing ext
  let config = { maxFileSizeMiB: 1 };
  const radar1 = new Radar(config);
  expect(radar1._checkFileSize(1048575)).toBe(true);
  expect(radar1._checkFileSize(1048576)).toBe(true);
  expect(radar1._checkFileSize(1048577)).toBe(false);

  const radar2 = new Radar();
  expect(radar2._checkFileSize(10485759)).toBe(true);
  expect(radar2._checkFileSize(10485760)).toBe(true);
  expect(radar2._checkFileSize(10485761)).toBe(false);
});

test("results map", () => {
  const path = "/root"
  const scannedFile1 = new ScannedFile(new File("test.txt", path, 123));
  const scannedFile2 = new ScannedFile(new File("anothertest.ext", path, 456));
  const scanResults = [scannedFile1, scannedFile2];

  expect(Radar._getResultsMap(path, scanResults)).toStrictEqual(
    {
      "test.txt": {
        metadata: {
          size: 123,
          extension: "txt",
          numLines: 0,
        },
        lines: [],
      },
      "anothertest.ext": {
        metadata: {
          size: 456,
          extension: "ext",
          numLines: 0,
        },
        lines: [],
      },
    }
  );
});
