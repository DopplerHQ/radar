const getCommandArgs = (args) => {
  const commandArgs = args.filter(arg => (arg !== "[object Object]"));
  commandArgs.pop();
  return commandArgs;
};

const parseStringArray = (str) => {
  if (str === undefined) {
    return [];
  }

  return str.split(",")
    .map(s => s.trim())
    .filter(value => (value !== ''));
};

const parseExtensionArray = (str) => {
  return parseStringArray(str)
    .map(ext => (ext.startsWith('.') ? ext.substring(1) : ext))
    .filter(value => (value !== ''));
}

const parseNumber = (num) => {
  if (num === undefined) {
    return undefined;
  }

  return Number.isInteger(Number(num)) ? num : undefined;
};

module.exports = { getCommandArgs, parseStringArray, parseExtensionArray, parseNumber };
