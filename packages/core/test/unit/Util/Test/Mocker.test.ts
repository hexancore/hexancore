import { Mocker } from '../../../../src/Util/Test/Mocker';
import { createMock } from 'ts-auto-mock';

/**
 * @group unit/core
 */

interface TestMock {
  a(): boolean;
}


describe('Mocker', () => {
  test('checkExpections()', async () => {
    const mock = new Mocker(createMock<TestMock>());

    mock.expect("a").andReturn(true);
    mock.i.a();
    mock.checkExpections();

  });


});
