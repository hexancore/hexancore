import FileType from 'file-type';
import { Readable } from 'stream';
import { AppError, AsyncResult, error, fromPromise, success } from '..';
export enum FileTypeReadableError {
  UNKNOWN = 'core.util.file_type_readable.unknown',
  UNSUPPORTED_TYPE = 'core.util.file_type_readable.unsupported_type',
  NOT_IMAGE = 'core.util.file_type_readable.not_image',
  NO_FILE = 'core.util.file_type_readable.no_file',
}

export class FileTypeReadable {
  protected constructor(public readonly stream: Readable, public readonly mime: string, public readonly ext: string) {}

  public static create(stream: Readable): AsyncResult<FileTypeReadable> {
    return this.createFileTypeStream(stream).andThen((fileTypeStream: any) => {
      return success(new FileTypeReadable(fileTypeStream, fileTypeStream.fileType.mime, fileTypeStream.fileType.ext));
    });
  }

  protected static createFileTypeStream(stream: Readable): AsyncResult<any> {
    return fromPromise(FileType.stream(stream), (e: any) => {
      stream.destroy();
      if (e.code === 'ENOENT') {
        return { type: FileTypeReadableError.NO_FILE, code: 404, error: e };
      }

      return { type: FileTypeReadableError.UNKNOWN, code: 500, error: e };
    }).andThen((fileTypeStream: any) => {
      if (!fileTypeStream.fileType) {
        fileTypeStream.resume();
        return error({ type: FileTypeReadableError.UNSUPPORTED_TYPE, code: 400 });
      }
      return success(fileTypeStream);
    });
  }
}

export class ImageFileReadable extends FileTypeReadable {
  public static create(stream: Readable): AsyncResult<ImageFileReadable> {
    return FileTypeReadable.createFileTypeStream(stream)
      .mapError((e: AppError) => {
        return e.type === FileTypeReadableError.UNSUPPORTED_TYPE ? { type: FileTypeReadableError.NOT_IMAGE, code: 400 } : e;
      })
      .andThen((v: any) => {
        const ext = v.fileType.ext;
        const isImage = ext === 'jpg' || ext === 'png';
        if (!isImage) {
          v.resume();
          return error(FileTypeReadableError.NOT_IMAGE, 400);
        }

        return success(new ImageFileReadable(v, v.fileType.mime, v.fileType.ext));
      });
  }
}
