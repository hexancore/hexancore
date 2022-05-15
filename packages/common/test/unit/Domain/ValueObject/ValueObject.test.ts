/**
 * @group unit/core
 */

import { checkEnumValueObject } from '@';

enum Test {
  a = 1,
  b = 2,
}

const TestEnumMeta = {
  module: 'Test',
  class: 'Test',
};

describe('ValueObject', () => {
  test('checkEnumValueObject when is valid ', () => {
    const result = checkEnumValueObject(Test.a, Test, TestEnumMeta);
    expect(result).toBeNull();
  });

  test('checkEnumValueObject when is  invalid ', () => {
    const result = checkEnumValueObject(10, Test, TestEnumMeta);
    expect(result).toMatchObject({});
  });
});
