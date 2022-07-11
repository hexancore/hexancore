/**
 * @group unit
 */

import { pascalCaseToCamelCase, pascalCaseToSnakeCase } from '@';

describe('Functions', () => {
  test('pascalCaseToSnakeCase()', () => {
    const s = 'TestStringColor';

    expect(pascalCaseToSnakeCase(s)).toBe('test_string_color');
  });

  test('pascalCaseToCamelCase()', () => {
    const s = 'TestStringColor';

    expect(pascalCaseToCamelCase(s)).toBe('testStringColor');
  });
});
