/**
 * @group unit/core
 */

import { AppError, ValueObject, NumericStringIdValue } from '@';

@ValueObject('Test')
class TestNumericStringId extends NumericStringIdValue<TestNumericStringId> {}

describe('NumericStringIdValue', () => {
  test('create', () => {
    const result = TestNumericStringId.c('10');
    expect(result.v.v).toBe("10");
  });

  test('create when invalid raw value', () => {
    const result = TestNumericStringId.c('-10');
    expect(result.isError()).toBe(true);

    expect(result.getErrorType()).toEqual('test.domain.value_object.test_numeric_string_id.invalid_raw_value');
  });
});
