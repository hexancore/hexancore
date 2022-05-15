import { PROJECT_ROOT_DIR } from '../../Constants';
import * as Path from 'path';
import { ModuleHelper } from '../../Util/ModuleHelper';
import { injectable } from 'inversify';
import { printError, printInfo } from '../../Util/ConsoleLog';
import { ModuleContent } from '../../Util/ModuleContent';
import { FilesystemHelper } from '../../Util/FilesystemHelper';
import { StringHelper } from '../../Util/StringHelper';

@injectable()
export class MakeModule {
  private moduleHelper: ModuleHelper;
  private filesystem: FilesystemHelper;

  public constructor(packageHelper: ModuleHelper, filesystem: FilesystemHelper) {
    this.moduleHelper = packageHelper;
    this.filesystem = filesystem;
  }

  public async execute(name: string, options: Record<string, any>): Promise<void> {
    if (!this.checkModuleName(name)) {
      return;
    }

    const content = ModuleContent.of(name, PROJECT_ROOT_DIR, 'MakeModule');

    printInfo('Making module: ' + name);
    this.createDirs(content);
    await this.createFiles(content);

    if (options.dryRun) {
      content.print();
    } else {
      content.save(this.filesystem);
    }
  }

  private checkModuleName(name: string): boolean {
    if (!this.moduleHelper.checkName(name)) {
      return false;
    }

    if (this.moduleHelper.isExists(name)) {
      printError('Module exists');
      return false;
    }

    return true;
  }

  private createDirs(content: ModuleContent): void {
    const srcDirs = [
      'Application/Command',
      'Application/Event',
      'Application/Query',
      'Domain/Entity',
      'Domain/Error',
      'Domain/Repository',
      'Domain/Dto',
      'Domain/Service',
      'Domain/SharedKernel/ValueObject',
      'Domain/ValueObject',
      'Infrastructure/Service',
      'Infrastructure/Persistence',
      'Infrastructure/Rest',
    ].map((path) => Path.join('src', content.moduleDir, path));

    const testDirs = ['unit', 'integration', 'functional'].map((path) => Path.join('test', path, content.moduleDir));

    srcDirs.concat(testDirs).forEach((path) => content.dir(path, true));
  }

  private async createFiles(content: ModuleContent): Promise<void> {
    await Promise.all([
      content.srcTemplateFile('Application/PrivateApplicationModule.ts.eta', `Application/${content.moduleClassPrefix}PrivateApplicationModule.ts`),
      content.srcTemplateFile('Application/PublicApplicationModule.ts.eta', `Application/${content.moduleClassPrefix}PublicApplicationModule.ts`),
      content.srcEmptyFile('Application/index.ts'),
      content.srcEmptyFile('Domain/index.ts'),
      content.srcTemplateFile(
        'Infrastructure/PrivateInfrastructureModule.ts.eta',
        `Infrastructure/${content.moduleClassPrefix}PrivateInfrastructureModule.ts`,
      ),
      content.srcTemplateFile('index.ts.eta', `index.ts`),
      content.srcTemplateFile('Module.ts.eta', `${content.moduleClassPrefix}Module.ts`),
    ]);
  }
}
