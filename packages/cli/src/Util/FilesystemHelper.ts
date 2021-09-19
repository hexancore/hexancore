import * as fs from 'fs-extra';
import * as Path from 'path';
import { injectable } from 'inversify';
import { FileItem } from './FileItem';

@injectable()
export class FilesystemHelper {
  public pathExists(path: string): boolean {
    return fs.pathExistsSync(path);
  }

  public async mkdirs(dirs: string[]): Promise<void> {
    await Promise.all(dirs.map((file: string) => this.mkdir(file)));
  }

  public async mkdir(dir: string): Promise<void> {
    const mode = 0o2775;
    await fs.ensureDir(dir, mode);
  }

  public async outputFiles(files: FileItem[]): Promise<void> {
    await Promise.all(files.map((file: FileItem) => this.outputFile(file)));
  }

  public async outputFile(file: FileItem): Promise<void> {
    return fs.outputFile(file.path, file.content);
  }

  public async readFile(path: string): Promise<string> {
    const buffer = await fs.readFile(path);
    return buffer.toString('utf8');
  }
}
