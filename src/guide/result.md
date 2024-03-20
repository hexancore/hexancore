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
```ts
function getData(): R<string> {
  return OK("data");
}

const dataResult = getData();
if (dataResult.isSuccess()) {
  console.log(dataResult.v);
} else {
  console.log("Result error");
}
```

In Example we used `OK()` to create `Result` instance with value `"data"`. After function call we can check is result is sucess with `Result.isSuccess()`. Value of result can be access with `Result.v` getter.

Now, let's see how to return error `Result`.

```ts
function parse(input: string): R<string, "my_module.domain.invalid_input"> {
  if (input.startsWith("test_")) {
    return OK("done");
  }

  return ERR("my_module.domain.invalid_input");
}

const parseResult = parse("invalid");
if (parseResult.isError()) {
  console.log(parseResult.e);
} else {
  console.log(parseResult.v);
}
```


