import { FileItem } from './FileItem';
import * as Eta from 'eta';
import * as Path from 'path';
import { CLI_ROOT_DIR } from '../Constants';
import { FilesystemHelper } from './FilesystemHelper';
const TEMPLATE_ROOT_DIR = Path.join(CLI_ROOT_DIR, 'templates');

export declare type TestType = 'unit' | 'integration' | 'functional';
export class ModuleContent {
  public readonly moduleName: string;
  public readonly moduleClassPrefix;
  public readonly rootDir: string;
  public readonly templateRootDir: string;

  public readonly dirs: Array<string>;
  public readonly files: Array<FileItem>;

  private constructor(moduleName: string, rootDir: string, templateRootDir: string) {
    this.moduleName = moduleName;
    this.moduleClassPrefix = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    this.rootDir = rootDir;
    this.templateRootDir = templateRootDir;

    this.dirs = [];
    this.files = [];
    Eta.configure({
      root: TEMPLATE_ROOT_DIR,
      async: true,
    });
  }

  public static of(name: string, rootDir: string, templateRootDir: string): ModuleContent {
    return new ModuleContent(name, rootDir, templateRootDir);
  }

  public testDir(path: string): this {
    this.dir(Path.join('test', path));
    return this;
  }

  public srcDir(path: string): this {
    this.dir(Path.join('src', path));
    return this;
  }

  public srcModuleDir(path: string): this {
    this.dir(Path.join('src', this.moduleName, path));
    return this;
  }

  public dir(path: string, addGitKeep = false): this {
    this.dirs.push(Path.join(this.rootDir, path));
    if (addGitKeep) {
      this.emptyFile(Path.join(path, '.gitkeep'));
    }
    return this;
  }

  public srcTemplateFile(templateFilePath: string, moduleFilePath: string, context?: Record<string, any>): Promise<this> {
    return this.templateFile(Path.join('src', templateFilePath), this.srcFile(moduleFilePath), context);
  }

  public srcEmptyFile(moduleFilePath: string): this {
    return this.emptyFile(this.srcFile(moduleFilePath));
  }

  public testTemplateFile(testType: TestType, templateFilePath: string, moduleFilePath: string, context?: Record<string, any>): Promise<this> {
    return this.templateFile(Path.join('test', testType, templateFilePath), this.testFile(testType, moduleFilePath), context);
  }

  public async templateFile(templateFilePath: string, moduleFilePath: string, context?: Record<string, any>): Promise<this> {
    context = context ?? {};
    context.moduleName = this.moduleClassPrefix;
    context.moduleImportName = this.moduleName;
    const content = (await Eta.renderFile(Path.join(TEMPLATE_ROOT_DIR, this.templateRootDir, templateFilePath), context)) as string;
    return this.stringFile(moduleFilePath, content);
  }

  public stringFile(moduleFilePath: string, content: string): this {
    this.files.push({
      path: Path.join(this.rootDir, moduleFilePath),
      content: content,
    });

    return this;
  }

  public emptyFile(moduleFilePath: string): this {
    this.stringFile(moduleFilePath, '');
    return this;
  }

  public print(): void {
    console.log(this.dirs);
    console.log(this.files);
  }

  public save(filesystem: FilesystemHelper): Promise<void> {
    filesystem.mkdirs(this.dirs);
    filesystem.outputFiles(this.files);
    return;
  }

  private srcFile(filePath: string): string {
    return Path.join('src', this.moduleName, filePath);
  }

  private testFile(testType: TestType, filePath: string): string {
    return Path.join('test', testType, this.moduleName, filePath);
  }
}
