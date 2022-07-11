/**
 * @group unit/core
 */

import { CommandBus, EventBus, ICommand, IEvent, IQuery, QueryBus } from '@nestjs/cqrs';
import { Mocker } from '@hexcore/mocker';
import { Email, ERR, ERRA, OK, OKA } from '@hexcore/common';
import { GeneralBus, DefaultGeneralBus } from '../../../../src';

class TestCommand implements ICommand {
  public readonly email: Email;
  public constructor(emailRaw: string) {
    this.email = Email.c(emailRaw).v;
  }
}

class TestEvent implements IEvent {
  public readonly email: Email;
  public constructor(emailRaw: string) {
    this.email = Email.c(emailRaw).v;
  }
}

class TestQuery implements IQuery {
  public readonly email: Email;
  public constructor(emailRaw: string) {
    this.email = Email.c(emailRaw).v;
  }
}

describe('DefaultGeneralBus', () => {
  let commandBus: Mocker<CommandBus>;
  let eventBus: Mocker<EventBus>;
  let queryBus: Mocker<QueryBus>;

  let generalBus: GeneralBus;
  beforeEach(() => {
    commandBus = Mocker.of();
    eventBus = Mocker.of();
    queryBus = Mocker.of();
    generalBus = new DefaultGeneralBus(commandBus.i, eventBus.i, queryBus.i);
  });

  afterEach(() => {
    commandBus.checkExpections();
    eventBus.checkExpections();
    queryBus.checkExpections();
  });

  test('handleCommand() when success result', async () => {
    const expectedResult = OKA(true);
    const command = new TestCommand('test@test.com');

    commandBus.expects('execute', command).andReturn(expectedResult);

    const currentResult = await generalBus.handleCommand(command);

    expect(currentResult).toEqual(OK(true));
  });

  test('handleCommand() when error result', async () => {
    const expectedResult = ERRA({ type: 'test' });
    const command = new TestCommand('test@test.com');

    commandBus.expects('execute', command).andReturn(expectedResult);

    const currentResult = await generalBus.handleCommand(command);

    expect(currentResult).toEqual(ERR({ type: 'test' }));
  });
});
