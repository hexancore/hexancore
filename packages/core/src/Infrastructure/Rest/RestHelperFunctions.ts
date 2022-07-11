import { AppError, AsyncResult, Result, SuccessResult } from '@hexcore/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as http2 from 'http2';
import { HttpStatus } from '@nestjs/common';

export declare type FResponse = FastifyReply<http2.Http2SecureServer>;

export function createErrorResponseBody(error: AppError): Record<string, any> {
  let body: Record<string, any>;
  if (error.error) {
    if (process.env.DEBUG || process.env.NODE_ENV === 'dev') {
      // when debug mode add more info to response
      body = {
        type: error.type,
        message: error.message,
        error: error.error,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: error.data,
        i18n: 'internal_error',
      };
    } else {
      // when is some unknown internal error and not debug mode output minimum info
      body = {
        type: 'internal_error',
        message: 'Internal server error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  } else {
    // when well defined error
    body = {
      type: error.type,
      code: error.code ?? HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (error.data) {
      body.data = error.data;
    }

    if (error.i18n) {
      body.i18n = error.i18n;
    }
  }

  return body;
}

export function sendErrorResponse(error: AppError, response: FResponse): void {
  const body = createErrorResponseBody(error);
  response.status(body.code);
  response.send(body);
}

export function sendResultResponse(result: Result<any>, response: FResponse, successCode = HttpStatus.OK): void {
  if (result.isError()) {
    sendErrorResponse(result.v, response);
  }

  if (successCode === HttpStatus.CREATED || successCode === HttpStatus.NO_CONTENT) {
    response.status(successCode);
    response.send();
    return;
  }
  response.send(result.v);
}

export async function sendAsyncResultResponse(result: AsyncResult<any>, response: FResponse, successCode = HttpStatus.OK): Promise<void> {
  sendResultResponse(await result, response, successCode);
}

export function checkResultAndSendOnError<T>(result: Result<T>, response: FResponse): SuccessResult<T> {
  if (result.isError()) {
    sendErrorResponse(result.e, response);
    return null;
  }

  return result;
}
