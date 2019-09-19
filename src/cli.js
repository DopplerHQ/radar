#!/usr/bin/env node

const program = require('commander');

const Radar = require('./radar');

program
  .name("radar")
  .version(Radar.version())
  .description("Detect API keys, credentials, and other sensitive secrets in your codebase")
  .command("scan <path>", "Scan a file, directory, or remote git repo for secrets", { executableFile: 'cli/scan' })
  .command("list <type>", "List available configuration", { executableFile: 'cli/list' })
  .action((command) => {
    const isCommandValid = program.commands.reduce((acc, subCommand) => (
      acc || (command === subCommand.name())
    ), false);

    if (!isCommandValid) {
      console.log("Invalid command:", command);
      program.help();
      return;
    }
  })
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
