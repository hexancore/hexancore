/**
 * @group unit/core
 */

import { Email, AppError } from '@';
import { EmailHash } from '../../../../src/Domain/ValueObject/EmailHash';

describe('Email', () => {
  test('create', () => {
    const result = Email.c('test@test.com');
    expect(result.isSuccess()).toBe(true);
    expect(result.v.v).toEqual('test@test.com');
  });
  test('create when invalid raw value', () => {
    const result = Email.c('test@test');
    expect(result.isError()).toBe(true);

    expect(result.getErrorType()).toEqual('core.domain.value_object.email.invalid_raw_value');
  });
  test('get local', () => {
    const result = Email.c('test@test.com');
    expect(result.v.local).toEqual('test');
  });
  test('get domain', () => {
    const result = Email.c('test@test.com');
    expect(result.v.domain).toEqual('test.com');
  });
  test('get hash', () => {
    const result = Email.c('test@test.com');
    expect(result.v.hash).toEqual(EmailHash.c("a6ad00ac113a19d953efb91820d8788e2263b28a"));
  });
});
