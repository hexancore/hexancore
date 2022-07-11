/**
 * @group unit/core
 */

import { UIntValue } from '../../../../src/Domain/ValueObject/UIntValue';

describe('UIntValue', () => {
  test('create', () => {
    const result = UIntValue.c(10);
    expect(result.v.v).toBe(10);
  });

  test('create when invalid raw value', () => {
    const result = UIntValue.c(-10);
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual('core.domain.value_object.u_int_value.invalid_raw_value');
  });
});
