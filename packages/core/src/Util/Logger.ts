import { LoggerService } from '@nestjs/common';
import { LambdaLog } from 'lambda-log';

export class NullLogger implements LoggerService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public log(message: any, ...optionalParams: any[]): any {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public error(message: any, ...optionalParams: any[]): any {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public warn(message: any, ...optionalParams: any[]): any {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public debug?(message: any, ...optionalParams: any[]): any {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public verbose?(message: any, ...optionalParams: any[]): any {}
}

export class LambdaLogger implements LoggerService {
  private readonly native: LambdaLog;

  public constructor(native: any) {
    this.native = native;
  }

  public static create(name: string, tags?: Array<string>): LoggerService {
    const native = new LambdaLog({
      dev: !process.env.STAGE || process.env.STAGE === 'dev',
      debug: process.env.DEBUG || false,
      silent: process.env.LOGGING_SILENT || false,
      meta: { name },
      tags: tags ?? [],
      levelKey: 'level',
      tagsKey: 'tags',
    });
    return new LambdaLogger(native);
  }

  public log(message: any, context?: any): any {
    this.native.info(message, context);
  }

  public warn(message: any, context?: any): any {
    this.native.warn(message, context);
  }

  public error(message: any, context?: any): any {
    this.native.error(message, context);
  }

  public debug?(message: any, context?: any): any {
    this.native.debug(message, context);
  }

  public verbose?(message: any, context?: any): any {
    this.native.debug(message, context);
  }
}
