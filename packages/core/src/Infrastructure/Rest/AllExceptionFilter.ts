import { AppError, FResponse, isAppError, sendErrorResponse } from '@';
import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { HttpException, LoggerService } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: LoggerService;

  public constructor(logger: LoggerService) {
    this.logger = logger;
  }

  public catch(error: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (this.isHttpException(error)) {
      this.processHttpException(error, response);
      return;
    }

    // any other error
    this.processInternalError(error as Error, response);
  }

  private processHttpException(error: HttpException, response: FResponse): void {
    if (error.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.processInternalError(error, response);
      return;
    }

    if (isAppError(error.getResponse())) {
      sendErrorResponse(<AppError>error.getResponse(), response);
      return;
    }

    const responseBody = <Record<string, any>>error.getResponse();
    sendErrorResponse(
      {
        type: responseBody.error.replace(' ', '_').toLowerCase(),
        code: error.getStatus(),
        message: responseBody.message,
      },
      response,
    );
  }

  public processInternalError(error: Error, response: FResponse): void {
    this.logger.error(error.message, error.stack);
    sendErrorResponse({ type: 'internal_error', error: error }, response);
  }

  private isHttpException(e: any): e is HttpException {
    return e.getStatus;
  }
}
