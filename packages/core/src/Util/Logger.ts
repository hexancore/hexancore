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

export class HexcoreLogger implements LoggerService {
  private readonly native: LambdaLog;

  public constructor(native: any) {
    this.native = native;
  }

  public static create(name: string, tags?: Array<string>): LoggerService {
    const native = new LambdaLog({
      dev: !process.env.HEXCORE_STAGE || process.env.HEXCORE_STAGE === 'dev',
      debug: !!(process.env.HEXCORE_DEBUG || false),
      silent: !!(process.env.HEXCORE_LOGGING_SILENT || false),
      meta: { name, appId: process.env.HEXCORE_APPID ?? 'App' },
      tags: tags ?? [],
      levelKey: 'level',
      tagsKey: 'tags',
    });
    return new HexcoreLogger(native);
  }

  public log(message: any, context?: any): any {
    this.native.info(message, { ctx: context });
  }

  public warn(message: any, context?: any): any {
    this.native.warn(message, { ctx: context });
  }

  public error(message: any, context?: any): any {
    if (context instanceof Error) {
      context = JSON.stringify(context, Object.getOwnPropertyNames(context));
    } else {
      if (typeof context === 'object') {
        Object.getOwnPropertyNames(context).map((prop) => {
          let value = context[prop];
          if (value instanceof Error) {
            value = JSON.stringify(context, Object.getOwnPropertyNames(context));
          }
          context[prop] = value;
        });
      }
    }

    this.native.error(message, { ctx: context });
  }

  public debug?(message: any, context?: any): any {
    this.native.debug(message, { ctx: context });
  }

  public verbose?(message: any, context?: any): any {
    this.native.debug(message, { ctx: context });
  }
}
