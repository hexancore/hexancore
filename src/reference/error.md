---
layout: doc
title: Error
---

## `AppError<ET, E>`

Unified error representation
**Properties**
- `type: string` - error type id: `<module>.<custom_id>`
- `code?: number` - code for use with REST api like `404`
- `data?: any` - some extra error context data
- `i18n?: string` - i18n message id for frontend
- `message?: string` - error message
- `error?: ET` - Error instance throws from wrapped 3rd code
- `cause?: AppError<Error>` - another `AppError` object that caused this error

**Special errors**

- `IGNORE_ERROR(): AppError` - used when some error can be ignored, but you need return some result
- `INTERNAL_ERROR(error: Error): AppError` - used for convert errors thrown from 3rd code like database connection error.