export class FilePath {
  public readonly path:string;

  public constructor(path: string) {
    this.path = path;
  }

  public toString(): string {
    return this.path;
  }
}