/**
 * @group unit/core
 */

import { Email, AppError } from "src";

describe('Email', () => {
  test('create', () => {
    const result = Email.create('test@test.com');
    expect(result.isSuccess()).toBe(true);
    expect((result.value as Email).getRaw()).toEqual('test@test.com');
  });
  test('create when invalid raw value', () => {
    const result = Email.create('test@test');
    expect(result.isError()).toBe(true);

    expect(result.getErrorType()).toEqual('core.domain.value_object.email.invalid_raw_value');
    expect((result.value as AppError).data).toEqual(["'test@test' is not email"]);
  });
  test('getLocal', () => {
    const result = Email.create('test@test.com');
    expect((result.value as Email).getLocalPart()).toEqual('test');
  });
  test('getDomain', () => {
    const result = Email.create('test@test.com');
    expect((result.value as Email).getDomain()).toEqual('test.com');
  });
});
