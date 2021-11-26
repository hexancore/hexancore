/**
 * @group unit/core
 */

import { pascalCaseToSnakeCase } from "@/Util/functions";

describe('Functions', () => {
  test('pascalCaseToSnakeCase()', () => {
    const s = "TestStringColor";

    expect(pascalCaseToSnakeCase(s)).toBe("test_string_color");
  });

});
