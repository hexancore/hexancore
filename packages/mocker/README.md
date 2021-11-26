# Hexcore Mocker

Mocker package is super simple wrapper for Jest mocks util with extra stuff :).

## Usage

```ts
import { Mocker } from '@hexcore/mocker';

interface TestMock {
  a(param1: string, param2: boolean): boolean;
  b(param1: string, param2: boolean): boolean;
}

// you can simply mock interface or class and give it descriptive name(used in errors)
const mock = Mocker.of<TestMock>("test_mock");

// define method call expectation(available methods list will be shows in VS)
mock.expects('a', 'test', true).andReturn(true);

// mock "i" attribute is object of mocked class, pass it where you need
mock.i.a('test', true);

// after execute your code, you can check sets expectations results with it(for many tests call it in jest "afterEach")
mock.checkExpections();
```

### Defining expectation

`Mocker::expects(method, ...args)` returns `MethodMock` object with you can define return value by:
*  `andReturnWith((implementation: (...args: any) => any)` - you can define your own method implementation
*  `andReturn(value: any)` - define returns passed value once
*  `andReturnResolved` - simple sugar function for andReturnWith((() => Promise.resolve(value))