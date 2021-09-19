import { Command } from 'commander';
import { Container } from 'inversify';
import 'reflect-metadata';
import { MakeModule } from './Command/MakeModule/MakeModule';
import { MakeModuleCommand } from './Command/MakeModuleCommand/MakeModuleCommand';

const program = new Command();
program.version('1.0.0');

const c = new Container({ defaultScope: 'Singleton', autoBindInjectable: true });

function makeModule() {
  const command = c.get(MakeModule);

  program
    .command('make:module <name>')
    .description('Creates new module based on user input')
    .option('--dryRun', 'Prints files and dirs to create', false)
    .action(async (name, options) => command.execute(name, options));
}

function makeModuleCommand() {
  const command = c.get(MakeModuleCommand);

  program
    .command('make:module:command <moduleName> <group> <name>')
    .description('Creates new module command based on user input')
    .option('--dryRun', 'Prints files and dirs to create', false)
    .action(async (moduleName, group, name, options) => command.execute(moduleName, group, name, options));
}

async function main() {
  makeModule();
  makeModuleCommand();
  await program.parseAsync(process.argv);
}

try {
  main();
} catch (error) {
  console.error(error);
}
