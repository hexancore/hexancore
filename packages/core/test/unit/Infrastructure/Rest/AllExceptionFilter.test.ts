import { AllExceptionFilter } from '../../../../src/Infrastructure/Rest/AllExceptionFilter';
import { Mocker } from '../../../../src/Util/Test/Mocker';
import { LoggerService, UnauthorizedException, ArgumentsHost } from '@nestjs/common';
import { AppError } from '../../../../lib/Util/AppError';
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
    const error = new UnauthorizedException({ type: 'test', code: 401 } as AppError);
    const argumentsHost = Mocker.of<ArgumentsHost>();
    const httpArgumentsHost = Mocker.of<HttpArgumentsHost>();
    const response = Mocker.of<FResponse>();
    response.expect("status");
    response.expect("send");
    httpArgumentsHost.expect('getResponse').andReturn(response.i);
    argumentsHost.expect('switchToHttp').andReturn(httpArgumentsHost.i);

    filter.catch(error, argumentsHost.i as ArgumentsHost);


    logger.checkExpections();
  });
});
