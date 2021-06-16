import { AppError } from '../..';
import { FastifyReply } from 'fastify';
import { Result, SuccessResult } from '../../Util/Result';

export function createErrorResponseBody(error: AppError): Record<string, any> {
  let body: Record<string, any>;
  if (error.error) {
    if (process.env.DEBUG || process.env.NODE_ENV === 'dev') {
      // when debug mode add more info to response
      body = {
        type: error.type,
        message: error.message,
        error: error.error,
        code: 500,
        data: error.data,
        i18n: 'internal_error',
      };
    } else {
      // when is some unknown internal error and not debug mode output minimum info
      body = {
        type: 'internal_error',
        message: 'Internal server error',
        code: 500,
      };
    }
  } else {
    // when well defined error
    body = {
      type: error.type,
      code: error.code??500,
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

export function sendErrorResponse(error: AppError, response: FastifyReply): void {
  const body = createErrorResponseBody(error);
  response.status(body.code);
  response.send(body);
}

export function sendResultResponse(result: Result<any>, response: FastifyReply, successCode = 200): void {
  if (result.isError()) {
    sendErrorResponse(result.value, response);
  }

  if (successCode === 201 || successCode === 204) {
    response.status(successCode);
    response.send();
    return;
  }
  response.send(result.value);
}

export function checkResultAndSendOnError<T>(result: Result<T>, response: FastifyReply): SuccessResult<T> {
  if (result.isError()) {
    sendErrorResponse(result.value, response);
    return null;
  }

  return result;
}
