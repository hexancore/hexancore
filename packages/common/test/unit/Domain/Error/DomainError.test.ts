/**
 * @group unit/core
 */

import { entityNotFoundErrorType, NotFoundEntityError } from '@/Domain/Error/DomainError';

describe('DomainError', () => {
  test('entityNotFoundErrorType()', () => {
    expect(entityNotFoundErrorType('TestModule', 'TestEntityType')).toBe('test_module.domain.entity.test_entity_type.not_found');
  });

  test('NotFoundEntityError()', () => {
    const expected = {
      type: 'test_module.domain.entity.test_entity_type.not_found',
      code: 404,
      data: {
        module: 'TestModule',
        entityType: 'TestEntityType',

        searchCriteria: { id: 'test' },
      },
    };
    expect(NotFoundEntityError('TestModule', 'TestEntityType', { id: 'test' })).toEqual(expected);
  });
});
