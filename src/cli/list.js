const program = require('commander');

const util = require('./util');


program
  .name("list")
  .description("List available configuration")
  .command("secrets", "Print all available secret types", { executableFile: 'list-secrets' })
  .command("filters", "Print all available filters", { executableFile: 'list-filters' })
  .command("defaults [name]", "Print the default configuration", { executableFile: 'list-defaults' })
  .action((...params) => {
    const args = util.getCommandArgs(params);

    if (args.length === 0) {
      program.help();
      return;
    }

    const programHasCommands = program.commands.length > 0;
    if (programHasCommands) {
      // check command is valid
      const command = args[0];
      const isValidCommand = program.commands.reduce((acc, subCommand) => (
        acc || (command === subCommand.name())
      ), false);

      if (!isValidCommand) {
        console.log("Invalid command:", command);
        return;
      }
    }
  })
  .parse(process.argv);
