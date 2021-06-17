import { LoggerService } from '@nestjs/common';
import { LambdaLog } from 'lambda-log';

export class NullLogger implements LoggerService {
  public log(message: any, context?: string) {}
  public error(message: any, trace?: string, context?: string) {}
  public warn(message: any, context?: string) {}
  public debug?(message: any, context?: string) {}
  public verbose?(message: any, context?: string) {}
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
      tags: tags,
    });

    return new LambdaLogger(native);
  }

  public  log(message: any, context?: string) {
    this.native.info(message, {ctx: context});
  }

  public  warn(message: any, context?: string) {
    this.native.warn(message, {ctx: context});
  }

  public error(message: any, trace?: string, context?: string) {
    this.native.error(message, {ctx: context});
  }

  public debug?(message: any, context?: string) {
    this.native.debug(message, {ctx: context});
  }

  public verbose?(message: any, context?: string) {
    this.native.debug(message, {ctx: context});
  }

}
