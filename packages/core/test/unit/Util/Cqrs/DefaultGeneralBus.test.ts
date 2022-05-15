/**
 * @group unit/core
 */

import { CommandBus, EventBus, ICommand, IEvent, IQuery, QueryBus } from '@nestjs/cqrs';
import { Email, successAsync, success, GeneralBus, DefaultGeneralBus, errorAsync, error } from '@';
import { Mocker } from '@hexcore/mocker';

class TestCommand implements ICommand {
  public readonly email: Email;
  public constructor(emailRaw: string) {
    this.email = Email.create(emailRaw).unwarp();
  }
}

class TestEvent implements IEvent {
  public readonly email: Email;
  public constructor(emailRaw: string) {
    this.email = Email.create(emailRaw).unwarp();
  }
}

class TestQuery implements IQuery {
  public readonly email: Email;
  public constructor(emailRaw: string) {
    this.email = Email.create(emailRaw).unwarp();
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
    const expectedResult = successAsync(true);
    const command = new TestCommand('test@test.com');

    commandBus.expects("execute", command).andReturn(expectedResult);

    const currentResult = await generalBus.handleCommand(command);

    expect(currentResult).toEqual(success(true));
  });

  test('handleCommand() when error result', async () => {
    const expectedResult = errorAsync({type:"test"});
    const command = new TestCommand('test@test.com');

    commandBus.expects("execute", command).andReturn(expectedResult);

    const currentResult = await generalBus.handleCommand(command);

    expect(currentResult).toEqual(error({type:"test"}));
  });
});
