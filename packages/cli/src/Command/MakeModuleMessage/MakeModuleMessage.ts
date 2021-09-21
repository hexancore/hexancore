import { PROJECT_ROOT_DIR } from '../../Constants';
import { ModuleHelper } from '../../Util/ModuleHelper';
import { injectable } from 'inversify';
import { printInfo } from '../../Util/ConsoleLog';
import { ModuleContent } from '../../Util/ModuleContent';
import { FilesystemHelper } from '../../Util/FilesystemHelper';
import { StringHelper } from '../../Util/StringHelper';

export declare type MessageType = 'Command' | 'Query' | 'Event';
@injectable()
export class MakeModuleMessage {
  private moduleHelper: ModuleHelper;
  private filesystem: FilesystemHelper;
  private messageType: MessageType;

  public constructor(packageHelper: ModuleHelper, filesystem: FilesystemHelper, messageType: MessageType) {
    this.moduleHelper = packageHelper;
    this.filesystem = filesystem;
    this.messageType = messageType;
  }

  public async execute(moduleName: string, group: string, name: string, options: Record<string, any>): Promise<void> {
    if (!this.moduleHelper.checkExists(moduleName)) {
      return;
    }

    group = group !== '' ? StringHelper.upperFirst(group) : '';
    name = StringHelper.upperFirst(name);
    printInfo(`Making ${this.messageType} '${name}' in group '${group}' in module '${moduleName}'`);

    const content = await this.createContent(moduleName, group, name);

    if (options.dryRun) {
      content.print();
    } else {
      content.save(this.filesystem);
    }
  }

  private async createContent(moduleName: string, group: string, name: string): Promise<ModuleContent> {
    const content = ModuleContent.of(moduleName, PROJECT_ROOT_DIR, 'MakeModuleMessage');
    this.createDirs(content, group, name);
    await this.createFiles(content, group, name);
    return content;
  }

  private createDirs(content: ModuleContent, group: string, name: string): void {
    if (this.isEventMaker()) {
      return;
    }

    content.srcModuleDir(`Application/${this.messageType}/${group}/${name}`, false);
  }

  private async createFiles(content: ModuleContent, group: string, name: string): Promise<void> {
    const messageClassName = group + name + this.messageType;

    let messagePath;
    if (this.isEventMaker()) {
      messagePath = `Domain/Event` + (group !== '' ? `/${group}/` : '');
    } else {
      messagePath = `Application/${this.messageType}/` + (group !== '' ? `${group}/` : '') + `${name}`;
    }

    const context = {
      group,
      name,
      messageType: this.messageType,
      messagePath,
      messageClassName: messageClassName,
      nestMessageAnnotation: this.messageType + 'Handler',
    };

    const files = [content.srcTemplateFile(`Message.ts.eta`, `${messagePath}/${messageClassName}.ts`, context)];

    if (!this.isEventMaker()) {
      files.push(content.srcTemplateFile(`MessageHandler.ts.eta`, `${messagePath}/${messageClassName}Handler.ts`, context));
      const testHandlerPath = `Application/${this.messageType}/` + (group !== '' ? `${group}/` : '');
      files.push(content.testTemplateFile('unit', 'MessageHandler.test.ts.eta', `${testHandlerPath}/${messageClassName}Handler.test.ts`, context));
    }

    await Promise.all(files);
  }

  private isEventMaker(): boolean {
    return this.messageType === 'Event';
  }
}
