import { Mocker } from '@hexcore/core';
import { createMock } from 'ts-auto-mock';
import { PostCreate5Query } from '@app/abc/Application/Query/Post/Create5/PostCreate5Query';
import { PostCreate5QueryHandler } from '@app/abc/Application/Query/Post/Create5/PostCreate5QueryHandler';


/**
 * @group unit/abc *
 */
describe('Command.Post.Create5', () => {
  let handler: PostCreate5QueryHandler;

  beforeEach(() => {
    handler = new PostCreate5QueryHandler();
  });

  test('execute()', async () => {
    const query = new PostCreate5Query();

    await handler.execute(query);
    fail('Need implementation');
  });
});
