import { AllExceptionFilter } from '../../../../src/Infrastructure/Rest/AllExceptionFilter';
import { Mocker } from '../../../../src/Util/Test/Mocker';
import { LoggerService, UnauthorizedException, ArgumentsHost } from '@nestjs/common';
import { createMock } from 'ts-auto-mock';
import { AppError } from '../../../../lib/Util/AppError';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { FResponse } from '@';
import { FastifyReply } from 'fastify';
describe('AllExceptionFilter', () => {
  let logger: Mocker<LoggerService>;
  let filter: AllExceptionFilter;

  beforeEach(() => {
    logger = new Mocker(createMock<LoggerService>());
    filter = new AllExceptionFilter(logger.i);
  });

  test('catch()', () => {
    const error = new UnauthorizedException({ type: 'test', code: 401 } as AppError);
    const argumentsHost = new Mocker(createMock<ArgumentsHost>());
    const httpArgumentsHost = new Mocker(createMock<HttpArgumentsHost>());
    const response = new Mocker(createMock<FResponse>());
    httpArgumentsHost.expect('getResponse').andReturn(response.i);
    argumentsHost.expect('switchToHttp').andReturn(httpArgumentsHost.i);

    filter.catch(error, argumentsHost.i);


    logger.checkExpections();
  });
});
