---

layout: doc
title: Result

---

# Result

## Why return instead of throw ?

A return some result object is technique that allows you to capture errors elegantly,
without contaminating your code with ugly conditionals and try/ catch statements.

From the book “Domain modeling made functional”; A great read, really recommended!

- try/catch/finally is verbose, indenting/nesting at least 1 scope deep, often also leading to multiple levels deep (within 1 or more functions)
- Errors become part of the return type signature; automatic documentation, and compiler assistance when missing to handle one
- It enables composability
- Throwing errors is expensive (stack traces etc), while for the error cases you would return, generally I see no use for stack traces. Now I’ll be the first to say: don’t prematurely optimize, but if you can design your application from the ground up to be performant, even in the expectable error cases; that’s great.

## Understanding the Result Class in TypeScript
Hexancore result implementation is located in [@hexancore/common](https://www.npmjs.com/package/@hexancore/common) package.

The Result class is a versatile tool in TypeScript programming, designed to elegantly handle operations that may either succeed or fail,
without resorting to throwing exceptions.
This approach is particularly useful in functional programming paradigms where immutability and function purity are emphasized.
Below, you'll find a comprehensive guide on how to work with the Result class.

### Introduction to the Result Class
The Result class encapsulates the outcome of an operation, which can either be a success carrying a value of type T,
or a failure represented by an AppError with an error type ET.
This pattern provides a robust mechanism to deal with errors by explicitly handling them through the type system rather than using exceptions.

### Constructing a Result
A Result can be instantiated directly through its constructor by providing a value or an error:

```ts
const successResult = new Result<number, 'my_module.domain.user.invalid_id'>(42);
const errorResult = new Result<number, 'my_module.domain.user.invalid_id'>(new AppError('my_module.domain.user.invalid_id'));
```
However, it's more common to use the provided factory functions `OK` and `ERR` for creating Result instances to signify success and failure, respectively:
const successResult = OK(42);
const errorResult = ERR('my_module.domain.user.invalid_id');


Let's see how to return success `Result` from function.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OK, R } from '@hexancore/common';

function getData(): R<string> {
  return OK("data");
}

const dataResult = getData();
if (dataResult.isSuccess()) {
  println(dataResult.v);
} else {
  println("Result error");
}
```
:::

In Example we used `OK()` to create `Result` instance with value `"data"`. After function call we can check result is success with `Result.isSuccess()`.
Value of result can be access with `Result.v` getter.

Now, let's see how to return error in `Result`.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OK, R, ERR } from '@hexancore/common';
function parse(input: string): R<string, "my_module.domain.invalid_input"> {
  if (input.startsWith("test_")) {
    return OK("done");
  }

  return ERR("my_module.domain.invalid_input");
}

const parseResult = parse("invalid");
if (parseResult.isError()) {
  println(parseResult.e);
} else {
  println(parseResult.v);
}

```
:::

`ERR()` is factory function for `Result` with `AppError`.
Convention of error type is `<module_id>.<application|domain|infra|util>.<rest_of_id>`.

### Result Chain

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OK, R, ERR } from '@hexancore/common';

function parse(input: string): R<string, 'my_module.domain.invalid_input'> {
  if (input.startsWith('test_')) {
    return OK("parsed :param");
  }

  return ERR('my_module.domain.invalid_input');
}

function replace(input: string, param: string): R<string, 'my_module.domain.invalid_input'> {
  return parse(input).onOk(parsed => parsed.replace(':param', param)); // replaced string will be automatically wrapped into a Result.
}

replace('test_string', 'param_value')
  .onOk((parsed) => {
    println(parsed)
  })
  .onErr((e) => {
    println(e);
  });
```
:::

### Combining Multiple Result Instances
The Result class offers static methods like `all` and `allToFirstError` for dealing with multiple Result instances,
making it easier to handle scenarios where multiple operations must succeed to proceed.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OK, R, ERR, Result } from '@hexancore/common';

const combinedResult = Result.all({
  first: OK(42),
  second: OK('Hello')
});

if (combinedResult.isSuccess()) {
  println('All operations succeeded: ' + JSON.stringify(combinedResult.v));
} else {
  println('One or more operations failed: ' + combinedResult.e.type);
}
```
:::

With chaining we can process success or error result without `ifs` and even start an asynchronous operation
 that returns AsyncResult - which will be discussed later in this tutorial.

### Panic 💥

A panic typically means something went unexpectedly wrong.
Mostly we use it to fail fast on errors that shouldn’t occur during normal operation,
or that we aren’t prepared to handle gracefully.

`Result.panicIfError()` method can be used to throw PanicError with information from error returned with `Result` instance.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OK, R, ERR } from '@hexancore/common';

function runPipeline(input: string): R<string, 'pipeline.infra.broken'> {
  return ERR("pipeline.infra.broken");
}

try {
const r = runPipeline().panicIfError();
} catch (e) {
  println(e.message);
}

```
:::


## AsyncResult
The AsyncResult class encapsulates the outcome of an asynchronous operation in the form of a Promise.
It extends the PromiseLike interface, allowing instances of AsyncResult to be awaited or used in promise chains.
The class offers a powerful API to work seamlessly with both synchronous and asynchronous flows, handling successes and failures elegantly.

### Constructing an AsyncResult
You typically do not create instances of AsyncResult directly using the constructor.
Instead, use provided warppers `OKA`, `ERRA`, `ARW` for wrapping operation values/errors or promises.


### Success

Async error result factory equivalent is `OKA`

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OKA, AR } from '@hexancore/common';

function runPipeline(input: string): AR<string> {
  return OKA("data");
}

runPipeline().onOk(v => {
  println(v);
});
```
:::


### Error

Async error result factory equivalent is `ERRA`

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OKA, AR, ERRA } from '@hexancore/common';

function runPipeline(input: string): AR<string, 'pipeline.infra.broken'> {
  return input === 'valid' ? OKA('data') : ERRA('pipeline.infra.broken');
}

runPipeline('invalid')
  .onOk(v => {
    println(v);
  })
  .onErr(e => {
    println(e);
  });
```
:::

### Async/Await

With async/await return type of function can use shortcut type `ARP`.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { OK, ARP, ERR } from '@hexancore/common';

async function runPipeline(input: string): ARP<string, 'pipeline.infra.broken'> {
  return input === 'valid' ? OK('data') : ERR('pipeline.infra.broken');
}

async function run() {
  return (await runPipeline('valid'))
    .onOk(v => {
      println(v);
    })
    .onErr(e => {
      println(e);
    });
}

run();
```
:::

### Chaining AsyncResults
The `onOk` and `onErr` methods return new instances of AsyncResult,
allowing you to chain multiple asynchronous operations elegantly.
Each method handles its respective case and passes control to the next appropriate handler in the chain.


### Experimental APIs(stable soon)
AsyncResult also offers experimental APIs like `bind`, `onOkBind`, and `onErrBind` for more advanced use cases.
These methods allow binding of this context or partially applying arguments to callback functions,
providing greater flexibility in handling results.

###  3rd Code helpers

**ARW**

To deal with code who don't use result logic we can use `ARW` wrapper to wrap promises into AsyncResult instances.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { ARW } from '@hexancore/common';

async function readFile(path: string): Promise<string> {
  return 'data';
}

// second parameter of ARW is optional ErrorFn with we can map any catched Error from Promise to AppError.
ARW(readFile('test.txt'), (e) => (e instanceof AppError ? e : INTERNAL_ERROR(e as Error)))
  .onOk(v => {
    println(v);
  })
  .onErr(e => {
    println(e);
  });
```
:::

**OKAP/ERRAP**

When 3rd code has some interfaces with Promises we can use shortcuts like `OKAP`/`ERRAP` to return promise with result instance
or use `AsyncResult.p` getter.

::: hc-sandbox {template=vanilla-ts}
<<< @/snippets/HtmlConsole.ts{prefix=#hidden/}
```ts index.ts [active]
import { println } from './HtmlConsole';
import { ARW,AR,OKAP } from '@hexancore/common';

// Interface from some lib we need implement
interface SomeInterface {
  read(path: string): Promise<number>;
}

class MyClass implements SomeInterface {
  public read(path: string): Promise<number> {

    return path === 'first' ? OKAP(399): this.someInternalOperation().p;
  }

  private someInternalOperation() : AR<number> {
    return OKA(233);
  }
}

const obj = new MyClass();

ARW(obj.read('first'))
  .onOk(v => {
    println(v);
  })
  .onErr(e => {
    println(e);
  });
```
:::
