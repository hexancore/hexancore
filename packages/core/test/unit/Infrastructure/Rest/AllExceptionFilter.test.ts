import { AllExceptionFilter } from '../../../../src/Infrastructure/Rest/AllExceptionFilter';
import { Mocker } from '@hexcore/mocker';
import { AppError } from '@hexcore/common';
import { LoggerService, UnauthorizedException, ArgumentsHost } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { FResponse } from '@';

describe('AllExceptionFilter', () => {
  let logger: Mocker<LoggerService>;
  let filter: AllExceptionFilter;

  beforeEach(() => {
    logger = Mocker.of<LoggerService>();
    filter = new AllExceptionFilter(logger.i);
  });

  test('catch()', () => {
    const error = new UnauthorizedException(new AppError({ type: 'test', code: 401 }));
    const argumentsHost = Mocker.of<ArgumentsHost>();
    const httpArgumentsHost = Mocker.of<HttpArgumentsHost>();
    const response = Mocker.of<FResponse>();
    response.expects('status');
    response.expects('send');
    httpArgumentsHost.expects('getResponse').andReturn(response.i);
    argumentsHost.expects('switchToHttp').andReturn(httpArgumentsHost.i);

    filter.catch(error, argumentsHost.i as ArgumentsHost);

    logger.checkExpections();
  });
});
