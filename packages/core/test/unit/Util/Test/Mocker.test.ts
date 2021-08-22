import { Mocker } from '../../../../src/Util/Test/Mocker';
import { createMock } from 'ts-auto-mock';

/**
 * @group unit/core
 */

interface TestMock {
  a(param1: string, param2: boolean): boolean;
}


describe('Mocker', () => {
  test('checkExpections() when called with expected arguments', async () => {
    const mock = new Mocker(createMock<TestMock>());

    mock.expect("a", "test", true).andReturn(true);
    mock.i.a("test", true);
    mock.checkExpections();

  });

  test('checkExpections() when called with not expected arguments', async () => {
    const mock = new Mocker(createMock<TestMock>());

    mock.expect("a", "test", true).andReturn(true);
    mock.i.a("not test", false);

    expect(() => mock.checkExpections()).toThrow();
  });

  test('checkExpections() when not called', async () => {
    const mock = new Mocker(createMock<TestMock>());

    mock.expect("a", "test", true).andReturn(true);

    expect(() => mock.checkExpections()).toThrow();
  });

});
