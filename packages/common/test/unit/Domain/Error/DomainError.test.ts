/**
 * @group unit/common
 */

import { ERR } from '@';
import { DefineDomainErrors, standard_entity_error_types } from '@/Domain/Error/DomainError';

describe('DomainError', () => {
  test('DefineDomainErrors', () => {
    const errors = DefineDomainErrors(
      'Test',
      new (class TestDomainErrors {
        entity_test_1: standard_entity_error_types = 'not_found';
        entity_test_2: standard_entity_error_types | 'custom_1' = 'not_found';
        other_error = '';
      })(),
    );

    expect(errors.entity.test_1.t('not_found')).toBe('test.domain.entity.test_1.not_found');
    expect(errors.entity.test_1.t('duplicate')).toBe('test.domain.entity.test_1.duplicate');

    expect(errors.entity.test_1.err('not_found', 'test_data')).toEqual(ERR('test.domain.entity.test_1.not_found', 404, 'test_data'));
    expect(errors.entity.test_1.err('duplicate')).toEqual(ERR('test.domain.entity.test_1.duplicate', 400));

    expect(errors.entity.test_2.t('not_found')).toBe('test.domain.entity.test_2.not_found');
    expect(errors.entity.test_2.t('duplicate')).toBe('test.domain.entity.test_2.duplicate');
    expect(errors.entity.test_2.t('custom_1')).toBe('test.domain.entity.test_2.custom_1');

    expect(errors.entity.test_2.err('not_found', 'test_data')).toEqual(ERR('test.domain.entity.test_2.not_found', 404, 'test_data'));
    expect(errors.entity.test_2.err('duplicate')).toEqual(ERR('test.domain.entity.test_2.duplicate', 400));
    expect(errors.entity.test_2.err('custom_1')).toEqual(ERR('test.domain.entity.test_2.custom_1', 400));

    expect(errors.other_error + '').toBe('test.domain.other_error');
    expect(errors.other_error.err()).toEqual(ERR('test.domain.other_error', 400));

    const objectStringProp = {
      [errors.other_error]: 'test',
    };

    expect(objectStringProp).toEqual({ 'test.domain.other_error': 'test' });
  });
});
