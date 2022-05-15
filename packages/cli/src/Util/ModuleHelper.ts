import { FilesystemHelper } from './FilesystemHelper';
import * as Path from 'path';
import { PROJECT_SRC_DIR } from '../Constants';
import { injectable } from 'inversify';
import { printError } from './ConsoleLog';
import { StringHelper } from './StringHelper';

@injectable()
export class ModuleHelper {
  private readonly filesystemHelper: FilesystemHelper;

  public constructor(filesystemHelper: FilesystemHelper) {
    this.filesystemHelper = filesystemHelper;
  }

  public isExists(name: string): boolean {
    const dirname = StringHelper.splitPascalCase(name).join('_').toLowerCase();
    return this.filesystemHelper.pathExists(Path.join(PROJECT_SRC_DIR, dirname));
  }

  public checkName(name: string): boolean {
    if (!/[a-zA-Z]+/.test(name)) {
      printError('Module name must be only letters');
      return false;
    }

    return true;
  }

  public checkExists(name: string): boolean {
    if (!this.isExists(name)) {
      printError('Module not exists');
      return false;
    }

    return true;
  }
}
