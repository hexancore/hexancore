import { LambdaLog } from 'lambda-log';

export interface Logger {
  // eslint-disable-next-line @typescript-eslint/ban-types
  error(message: string, meta?: object, tags?: Array<string>): void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  warn(message: string, meta?: object, tags?: Array<string>): void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  info(message: string, meta?: object, tags?: Array<string>): void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  debug(message: string, meta?: object, tags?: Array<string>): void;
}

export class NullLogger implements Logger {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public error(message: string, meta?: object, tags?: string[]): void {}

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public warn(message: string, meta?: object, tags?: string[]): void {}

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public info(message: string, meta?: object, tags?: Array<string>): void {}

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public debug(message: string, meta?: object, tags?: Array<string>): void {}
}

export class LambdaLogger implements Logger {
  private readonly log: LambdaLog;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public constructor(native: any) {
    this.log = native;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public static create(name: string, context?: object, tags?: Array<string>): Logger {
    const log = new LambdaLog({
      dev: !process.env.STAGE || process.env.STAGE === 'dev',
      debug: process.env.DEBUG || false,
      silent: process.env.LOGGING_SILENT || false,
      meta: { loggerName: name, context },
      tags: tags,
    });

    return new LambdaLogger(log);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public info(message: string, meta?: object, tags?: Array<string>): void {
    this.log.info(message, meta, tags);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public warn(message: string, meta?: object, tags?: Array<string>): void {
    this.log.warn(message, meta, tags);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public error(message: string, meta?: object, tags?: Array<string>): void {
    this.log.error(message, meta, tags);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public debug(message: string, meta?: object, tags?: Array<string>): void {
    this.log.debug(message, meta, tags);
  }
}

export class LoggerService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static create(name: string, context?: object, tags?: Array<string>): Logger {
    return LambdaLogger.create(name, context, tags);
  }
}
