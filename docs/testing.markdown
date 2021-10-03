---
layout: page
title: Testing
permalink: /testing
---

Hexcore has some extra stuff for writing tests and support only Jest now.

## Global test setup
Use in your jest setup config file.
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

## Mocker
Very simple helper stuff to create mocks based on Jest.Mock

Example:
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
    const email = Email.create('test@makeupfield.com').unwarp();
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
