import { Mocker } from '@hexcore/core';
import { createMock } from 'ts-auto-mock';
import { PostCreate5Command } from '@app/abc/Application/Command/Post/Create5/PostCreate5Command';
import { PostCreate5CommandHandler } from '@app/abc/Application/Command/Post/Create5/PostCreate5CommandHandler';


/**
 * @group unit/abc *
 */
describe('Command.Post.Create5', () => {
  let handler: PostCreate5CommandHandler;

  beforeEach(() => {
    handler = new PostCreate5CommandHandler();
  });

  test('execute()', async () => {
    const command = new PostCreate5Command();

    await handler.execute(command);
    fail('Need implementation');
  });
});
