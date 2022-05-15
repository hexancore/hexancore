/**
 * @group unit/core
 */

import { IntegerIdValue, AppError, ValueObject } from '@';

@ValueObject("Test")
class TestIntegerId extends IntegerIdValue<TestIntegerId> {}

describe('IntegerIdValue', () => {
  test('create', () => {
    const result = TestIntegerId.c(10);
    expect(result.v.v).toBe(10);
  });

  test('create when invalid raw value', () => {
    const result = TestIntegerId.c(-10);
    expect(result.isError()).toBe(true);

    expect(result.getErrorType()).toEqual('test.domain.value_object.test_integer_id.invalid_raw_value');
  });
});
