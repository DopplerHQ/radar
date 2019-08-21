const getCommandArgs = (args) => {
  const commandArgs = args.filter(arg => (arg !== "[object Object]"));
  commandArgs.pop();
  return commandArgs;
};

const parseStringArray = str => str.split(",").map(s => s.trim()).filter(value => value !== '');

module.exports = { getCommandArgs, parseStringArray };
