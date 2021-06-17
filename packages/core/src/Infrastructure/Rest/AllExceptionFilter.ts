import { AppError, isAppError, sendErrorResponse } from '@';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException, LoggerService } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: LoggerService;

  public constructor(logger: LoggerService) {
    this.logger = logger;
  }

  public catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (error instanceof HttpException) {
      if (error.getStatus() >= 500) {
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
      return;
    }

    // any other error
    this.processInternalError(error, response);
  }

  public processInternalError(error: Error, response: FastifyReply): void {
    this.logger.error(error.message, error.stack);
    sendErrorResponse({ type: 'internal_error', error: error }, response);
  }
}
