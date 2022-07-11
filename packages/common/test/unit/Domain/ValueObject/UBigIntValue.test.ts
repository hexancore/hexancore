/**
 * @group unit/core
 */

import { UBigIntValue } from '../../../../src';

class CustomUBigInt extends UBigIntValue {
  public customMethod() {
    return 'test';
  }
}

describe('UBigIntValue', () => {
  test('create from string', () => {
    const result = UBigIntValue.c('10');
    expect(result.v.v).toBe(10n);
  });

  test('create when invalid string raw value', () => {
    const result = UBigIntValue.c('-10');
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual('core.domain.value_object.u_big_int_value.invalid_raw_value');
  });

  test('create from bigint', () => {
    const result = UBigIntValue.c(10n);
    expect(result.v.v).toBe(10n);
  });

  test('create custom', () => {
    const result = CustomUBigInt.c(10n);
    expect(result.v).toBeInstanceOf(CustomUBigInt);
    expect(result.v.v).toBe(10n);
  });

  test('Json.string', () => {
    const vo = CustomUBigInt.cs(10n);
    const current = JSON.stringify(vo);
    expect(current).toEqual('"10"');
  });
});
