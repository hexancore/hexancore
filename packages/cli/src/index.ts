import { Command, CommanderStatic } from 'commander';
import { Container } from 'inversify';
import 'reflect-metadata';
import registerCommands from './Command/registerCommands';

const cli = (new Command()).version('1.0.0');

async function main() {
  const c = new Container({ defaultScope: 'Singleton', autoBindInjectable: true });
  registerCommands(cli, c);
  await cli.parseAsync(process.argv);
}

try {
  main();
} catch (error) {
  console.error(error);
}
