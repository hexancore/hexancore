import { Command } from 'commander';
import { Container, interfaces } from 'inversify';
import { FilesystemHelper } from '../Util/FilesystemHelper';
import { ModuleHelper } from '../Util/ModuleHelper';
import { MakeModule } from './MakeModule/MakeModule';
import { MakeModuleMessage, MessageType } from './MakeModuleMessage/MakeModuleMessage';

function makeModule(cli: Command, c: Container): void {
  const command = c.get(MakeModule);

  cli
    .command('make:module <name>')
    .description('Creates new module')
    .option('--dryRun', 'Prints files and dirs to create', false)
    .action(async (name, options) => command.execute(name, options));
}

function makeModuleCommand(cli: Command, makeMessageFactory: (messageType: MessageType) => MakeModuleMessage): void {
  const command = makeMessageFactory('Command');

  cli
    .command('make:module:command <moduleName> <name> [group]')
    .description('Creates new module command')
    .option('--dryRun', 'Prints files and dirs to create', false)
    .action(async (moduleName, name, group, options) => command.execute(moduleName, group, name, options));
}

function makeModuleQuery(cli: Command, makeMessageFactory: (messageType: MessageType) => MakeModuleMessage): void {
  const command = makeMessageFactory('Query');

  cli
    .command('make:module:query <moduleName> <name> [group]')
    .description('Creates new module query')
    .option('--dryRun', 'Prints files and dirs to create', false)
    .action(async (moduleName, name, group, options) => command.execute(moduleName, group, name, options));
}

function makeModuleEvent(cli: Command, makeMessageFactory: (messageType: MessageType) => MakeModuleMessage): void {
  const command = makeMessageFactory('Event');

  cli
    .command('make:module:event <moduleName> <name> [group]')
    .description('Creates new module event')
    .option('--dryRun', 'Prints files and dirs to create', false)
    .action(async (moduleName, name, group, options) => command.execute(moduleName, group ?? '', name, options));
}

function makeModuleMessage(cli: Command, c: Container): void {
  const SMakeModuleMessageFactory = Symbol.for('SMakeModuleMessageFactory');
  c.bind<interfaces.Factory<MakeModuleMessage>>(SMakeModuleMessageFactory).toFactory<MakeModuleMessage>((context: interfaces.Context) => {
    return (messageType: MessageType) => {
      return new MakeModuleMessage(context.container.get(ModuleHelper), context.container.get(FilesystemHelper), messageType);
    };
  });
  const makeMessageFactory: (messageType: MessageType) => MakeModuleMessage = c.get(SMakeModuleMessageFactory);

  makeModuleCommand(cli, makeMessageFactory);
  makeModuleQuery(cli, makeMessageFactory);
  makeModuleEvent(cli, makeMessageFactory);
}

export default function (cli: any, c: Container): void {
  makeModule(cli, c);
  makeModuleMessage(cli, c);
}
