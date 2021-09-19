import { FilesystemHelper } from './FilesystemHelper';
import * as Path from 'path';
import { PROJECT_SRC_DIR } from '../Constants';
import { injectable } from 'inversify';
import { printError } from './ConsoleLog';

@injectable()
export class ModuleHelper {
  private readonly filesystemHelper: FilesystemHelper;

  public constructor(filesystemHelper: FilesystemHelper) {
    this.filesystemHelper = filesystemHelper;
  }

  public isExists(name: string): boolean {
    return this.filesystemHelper.pathExists(Path.join(PROJECT_SRC_DIR, name));
  }

  public checkName(name: string): boolean {
    if (!/[a-z]+/.test(name)) {
      printError('Module name must be only lower letters');
      return false;
    }
  }

  public checkExists(name: string): boolean {
    if (!this.isExists(name)) {
      printError('Module not exists');
      return false;
    }

    return true;
  }
}
