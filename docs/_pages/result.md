---
layout: page
title: Result
permalink: /result
nav_order: 2
---

# Intro
Why return instead of throw ?
A return some result object is technique that allows you to capture errors elegantly, without contaminating your code with ugly conditionals and try/ catch statements.

From the book “Domain modeling made functional”; A great read, really recommended!

- try/catch/finally is verbose, indenting/nesting at least 1 scope deep, often also leading to multiple levels deep (within 1 or more functions)
- Errors become part of the return type signature; automatic documentation, and compiler assistance when missing to handle one
- It enables composability
- Throwing errors is expensive (stack traces etc), while for the error cases you would return, generally I see no use for stack traces. Now I’ll be the first to say: don’t prematurely optimize, but if you can design your application from the ground up to be performant, even in the expectable error cases; that’s great.

## `Result<T>`(`R<T>`)
In package `@hexcore/common` you can find some result stuff.

**`OK<T>(result: T): R<T>`**
Creates success `Result`(`R` is alias) with given value.
```ts
function doSomething(): R<string> {
  return OK("data");
}
```

**`ERR<T>(error: AppError | Partial<AppError> | string, code = 400, data?: any): R<T>`**
Creates error `Result` with given error info.
```ts
function doSomething(input: string): R<string> {
  if (input.startsWith("test_")) {
    return OK("done");
  }

  return ERR("my_module.domain.invalid_input");
}
```

**Methods:**

**`map<U>(fn: (v: T) => U): R<U>`**
Maps value from success result to new result with value returned from passed function.
```ts
const r = doSomething().map((v:string) => v.toUpperCase());
```

**`onOk<U>(fn: (v: T) => R<U>): R<U>`**
Returns result from passed function
```ts
const r = doSomething().onOK((v:string) => OK(v.toUpperCase()));
```

**`mapErr(fn: (e: AppError) => AppError | AppErrorProps): R<T>`**
Maps error from result to new result with error returned from passed function.
```ts
const r = doSomething().mapErr((e: AppError) => ({type: "my_module.new_error_type", code: 400}));
```

**`onErr<U>(fn: ((e: AppError) => R<U>) | Record<string, (e: AppError) => R<U>>): R<U | T>`**
```ts
const r = doSomething().onErr((e: AppError) => OK("new_data"));
```

### `AppError<ET>`
Unified error representation in result
**Properties:**
- `type: string` - error type as string id: `<module>.<custom_id>`
- `code?: number` - code for use with REST api like `404`
- `data?: any` - some extra error context data
- `i18n?: string` - custom i18n message id
- `message?: string` - error message
- `error?: ET` - Error instance throws from wrapped 3rd code
- `cause?: AppError<Error>` -  another `AppError` object that caused this error

** Special errors:**

- `IGNORE_ERROR(): AppError` - used when some error can be ignored, but you need return some result
- `INTERNAL_ERROR(error: Error): AppError` - used for convert errors thrown from 3rd code like database connection error.

### `AsyncResult<T>`(`AR<T>`)
AsyncResult is used wherever Promise is returned.

**`OKA<T>(v: T): AR<T>`**
Returns new success AsyncResult with given value
```ts
function doSomething(): AR<string> {
  return OKA("data");
}
```

**`ERRA<T>(v: T): AR<T>`**
Returns new success AsyncResult with given value
```ts
function doSomething(): AR<string> {
  return ERRA("my_module.error_type");
}
```

**Methods:**

**`map<U>(f: (v: T) => U | Promise<U>): AR<U>`**
Maps value from success result to new result with value returned from passed function.
```ts
const r = doSomething().map((v:string) => v.toUpperCase());
```

**`mapToTrue(): AR<boolean>`**
Shortcut of: `r.map(() => true)`

**`onOk<U>(f: (v: T) => SAR<U>): AR<U>`**
Returns result from passed function(`SAR<U>` - result can be `R` or `AR`)

```ts
const r = doSomething().onOK((v:string) => OK(v.toUpperCase()));
```

**`mapErr(fn: (e: AppError) => AppError | AppErrorProps): R<T>`**
Maps error from result to new result with error returned from passed function.
```ts
const r = doSomething().mapErr((e: AppError) => ({type: "my_module.new_error_type", code: 400}));
```

**`onErr<U = T>(f: ((e: AppError) => SAR<U>) | Record<string, (e: AppError) => SAR<U>>): AR<U>`**
```ts
const r = doSomething().onErr((e: AppError) => OK("new_data"));
```
Or
```ts
const r = doSomething().onErr({
  "my_module.error_type": (e: AppError) => OK("new_data")
});
```

**3rd code**

**`P<T>(promise: Promise<T>, errorFn?: (e: unknown) => AppError): AR<T>`**
Use to wrap lib code when throws any error.
Parameter `errorFn` default will return `INTERNAL_ERROR`


**`PS<T>(promise: Promise<T>): AR<T>`**
Use to wrap lib code when not throws any error.

**`OKAP<T>(v: T): ARP<T>`**
Use to wrap lib code when you need return Promise<T> to lib code.

**`ERRAP<T>(err: AppError): ARP<T>`**
Use to wrap lib code when you need return Promise<T> to lib code.

`Result` has method to start async chain too:

**`onOkA<U>(f: (v: T) => AR<U>): AR<U>`**
Return AsyncResult from passed function
```ts
const r = doSomething().onOkA((v:string) => OKA(v.toUpperCase()));
```




