---

layout: doc
title: Result

---

## Intro
**Why return instead of throw ?**

A return some result object is technique that allows you to capture errors elegantly, without contaminating your code with ugly conditionals and try/ catch statements.

From the book “Domain modeling made functional”; A great read, really recommended!

- try/catch/finally is verbose, indenting/nesting at least 1 scope deep, often also leading to multiple levels deep (within 1 or more functions)
- Errors become part of the return type signature; automatic documentation, and compiler assistance when missing to handle one
- It enables composability
- Throwing errors is expensive (stack traces etc), while for the error cases you would return, generally I see no use for stack traces. Now I’ll be the first to say: don’t prematurely optimize, but if you can design your application from the ground up to be performant, even in the expectable error cases; that’s great.

## Result
Hexancore result implementation is located in [@hexancore/common](https://www.npmjs.com/package/@hexancore/common) package.

`Result` object represents operation return value(success or error).
Asynchronous operation will use `AsyncResult` for this purpose.

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

In Example we used `OK()` to create `Result` instance with value `"data"`. After function call we can check is result is sucess with `Result.isSuccess()`. Value of result can be access with `Result.v` getter.

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

function parse(input: string): R<string, "my_module.domain.invalid_input"> {
  if (input.startsWith("test_")) {
    return OK("parsed :param");
  }

  return ERR("my_module.domain.invalid_input");
}

function replace(input: string, param: string): R<string, "my_module.domain.invalid_input"> {
  return parse(input).onOk(parsed => parsed.replace(":param", param));
}

replace("test_string", "param_value")
  .onOk((parsed) => {
    println(parsed)
  })
  .onErr((e) => {
    println(e);
  });
```
:::

With chaining we can process success or error result without `ifs` and even start an asynchronous operation
 that returns AsyncResult - which will be discussed later in this tutorial.