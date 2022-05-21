---
layout: page
title: Testing
permalink: /testing
---

Hexcore has some extra stuff for writing tests and support only Jest now.

## Global test setup
Use in your Jest setup config file.
```ts
import '@hexcore/core/lib/Util/Test/global-test-setup';
```

## MockGeneralBus
Class for simulate handling command, queries and events
### Example
```ts
describe('Command.User.Create', () => {
  let generalBus: MockGeneralBus;
  let handler: UserCreateCommandHandler;

  beforeEach(() => {
    generalBus = new MockGeneralBus(); // instance
    handler = new UserCreateCommandHandler(generalBus);
  });

  test('execute()', async () => {
    const command = new UserCreateCommand("test_username");

    // simple expection define:
    generalBus.expectHandleCommand(new SendEmailToCommand("test_username"));

    // more complex expection define:
    generalBus.expectHandleEvent((event: IEvent) => {
      return event instanceof UserCreatedEvent && event.username === username;
    });

    const result = await handler.execute(command);

    expect(result).toMatchObject(success(true));
  });
});
```

## Mocker package `@hexcore/mocker`

Very simple helper stuff to create mocks based on Jest.Mock

### Usage:
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

### More complex example:
```ts
// You can create mock from class or interface
let userRepository = Mocker.of<UserRepository>();

// setting method expection on mock
userRepository
      .expect('save', expect.objectContaining({ email, username, password: hashedPassword }))
      .andReturn(successAsync(true));

// on test end call:
userRepository.checkExpections();
```

```ts
describe('Command.User.Create', () => {
  let userRepository: Mocker<UserRepository>;
  let generalBus: MockGeneralBus;
  let handler: UserCreateCommandHandler;

  beforeEach(() => {
    userRepository = Mocker.of<UserRepository>();
    generalBus = new MockGeneralBus();
    handler = new UserCreateCommandHandler(userRepository.i, generalBus);
  });

  test('execute()', async () => {
    const email = Email.create('test@test.com').unwarp();
    const username = Username.create('test').unwarp();
    const password = PlainPassword.create('Test123!');
    const command = new UserCreateCommand(username, email, password);

    const hashedPassword = 'test_hash';

    passwordService.expect('hash', password).andReturn(successAsync(hashedPassword));
    userRepository
      .expect('save', expect.objectContaining({ email, username, password: hashedPassword }))
      .andReturn(successAsync(true));
    generalBus.expectHandleEvent((event: IEvent) => {
      return event instanceof UserCreatedEvent && event.email === email && event.username === username;
    });

    const result = await handler.execute(command);

    passwordService.checkExpections();
    userRepository.checkExpections();
    expect(result).toMatchObject(success(true));
  });
});
```
