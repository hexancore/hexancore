---
layout: page
title: Testing
permalink: /testing
nav_order: 4
---

Hexancore has some extra stuff for writing tests and support only Jest now.

## MockGeneralBus
Class for simulate handling command, queries and events
### Example
```ts
describe('Command.User.Create', () => {
  let gb: MockGeneralBus;
  let handler: UserCreateCommandHandler;

  beforeEach(() => {
    gb = new MockGeneralBus(); // instance
    handler = new UserCreateCommandHandler(gb);
  });

  test('execute()', async () => {
    const command = new UserCreateCommand("test_username");

    // simple expection define:
    gb.expectHandleCommand(new SendEmailToCommand("test_username"));

    // more complex expection define:
    gb.expectHandleEvent((event: IEvent) => {
      return event instanceof UserCreatedEvent && event.username === username;
    });

    const result = await handler.execute(command);

    expect(result).toMatchObject(success(true));
  });
});
```

## Mocker package `@hexancore/mocker`

https://github.com/hexancore/mocker
