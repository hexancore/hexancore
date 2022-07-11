/**
 * @group unit/core
 */

import { ImmutableDate, AppError } from '@';

describe('ImmutableDate', () => {
  test('create and is immutable', () => {
    const date = new Date();
    const nowTimestamp = date.getTime();
    const result = ImmutableDate.c(date);
    date.setTime(nowTimestamp + 60 * 60 * 1000);
    expect(result.v.v.getTime()).toBe(nowTimestamp);
  });
  test('fromTimestamp', () => {
    const result = ImmutableDate.fromTimestamp(1652651144);
    expect(result.v.t).toBe(1652651144);
  });
  test('fromTimestamp when invalid raw value', () => {
    const result = ImmutableDate.fromTimestamp(-10);
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual('core.domain.value_object.immutable_date.invalid_raw_value');
    expect(result.e.data).toEqual({ msg: 'invalid timestamp', raw: -10 });
  });
});
