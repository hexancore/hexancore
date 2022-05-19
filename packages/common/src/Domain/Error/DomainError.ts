import { AppError } from '../../Util';
import { pascalCaseToSnakeCase } from '../../Util/functions';

export function entityNotFoundErrorType(module: string, entityType: string): string {
  return pascalCaseToSnakeCase(module) + '.domain.entity.' + pascalCaseToSnakeCase(entityType) + '.not_found';
}

export function isEntityNotFoundErrorType(e: AppError, module: string, entityType: string): boolean {
  return entityNotFoundErrorType(module, entityType) === e.type;
}

export function NotFoundEntityError(module: string, entityType: string, searchCriteria: Record<string, any>): AppError {
  return {
    type: entityNotFoundErrorType(module, entityType),
    code: 404,
    data: {
      module,
      entityType: entityType,
      searchCriteria,
    },
  };
}
