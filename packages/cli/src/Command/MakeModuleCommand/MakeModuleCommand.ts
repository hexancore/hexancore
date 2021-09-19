import { PROJECT_ROOT_DIR } from '../../Constants';
import { ModuleHelper } from '../../Util/ModuleHelper';
import { injectable } from 'inversify';
import { printInfo } from '../../Util/ConsoleLog';
import { ModuleContent } from '../../Util/ModuleContent';
import { FilesystemHelper } from '../../Util/FilesystemHelper';
import { StringHelper } from '../../Util/StringHelper';

@injectable()
export class MakeModuleCommand {
  private moduleHelper: ModuleHelper;
  private filesystem: FilesystemHelper;

  public constructor(packageHelper: ModuleHelper, filesystem: FilesystemHelper) {
    this.moduleHelper = packageHelper;
    this.filesystem = filesystem;
  }

  public async execute(moduleName: string, group: string, name: string, options: Record<string, any>): Promise<void> {
    if (!this.moduleHelper.checkExists(moduleName)) {
      return;
    }

    group = StringHelper.upperFirst(group);
    name = StringHelper.upperFirst(name);
    printInfo(`Making command '${name}' in group '${group}' in module '${moduleName}'`);

    const content = await this.createContent(moduleName, group, name);

    if (options.dryRun) {
      content.print();
    } else {
      content.save(this.filesystem);
    }
  }

  private async createContent(moduleName: string, group: string, name: string): Promise<ModuleContent> {
    const content = ModuleContent.of(moduleName, PROJECT_ROOT_DIR, 'MakeModuleCommand');
    this.createDirs(content, group, name);
    await this.createFiles(content, group, name);
    return content;
  }

  private createDirs(content: ModuleContent, group: string, name: string): void {
    content.srcModuleDir(`Application/Command/${group}/${name}`);
  }

  private async createFiles(content: ModuleContent, group: string, name: string): Promise<void> {
    const fullname = group + name;
    const context = {
      group,
      name,
      fullname
    };
    await Promise.all([
      content.srcTemplateFile('Application/Command.ts.eta', `Application/Command/${group}/${name}/${fullname}Command.ts`,context ),
      content.srcTemplateFile('Application/CommandHandler.ts.eta', `Application/Command/${group}/${name}/${fullname}CommandHandler.ts`,context ),
      content.testTemplateFile('unit', 'CommandHandler.test.ts.eta', `Command/${group}/${name}/${fullname}CommandHandler.test.ts`,context ),
    ]);
  }
}
