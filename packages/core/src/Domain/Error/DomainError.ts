import { AppError } from '../../Util';

export function entityNotFoundErrorType(module: string, entityType: string): string {
  return module.toLowerCase() + '.domain.entity.' + entityType.toLowerCase() + '.not_found';
}

export function NotFoundEntityError(module: string, entityType: string, searchCriteria: Record<string, string>): AppError {
  return {
    type: entityNotFoundErrorType(module, entityType),
    code: 404,
    data: {
      entityType: entityType,
      searchCriteria,
    },
  };
}
