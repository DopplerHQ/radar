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
  if (num === undefined || num === "") {
    return undefined;
  }

  const number = Number(num);
  return Number.isInteger(number) ? number : undefined;
};

module.exports = { getCommandArgs, parseStringArray, parseExtensionArray, parseNumber };
