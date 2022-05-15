/**
 * @group unit
 */

import { pascalCaseToSnakeCase } from '@';

describe('Functions', () => {
  test('pascalCaseToSnakeCase()', () => {
    const s = 'TestStringColor';

    expect(pascalCaseToSnakeCase(s)).toBe('test_string_color');
  });
});
