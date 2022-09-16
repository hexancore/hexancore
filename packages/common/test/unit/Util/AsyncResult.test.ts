/**
 * @group unit
 */

import { ERR, OK, OKA, R } from '@';
import path from 'path';

describe(path.basename(__filename, '.test.ts'), () => {
  test('onOk() when Promise return ', async () => {
    const current = await OKA('test_data').onOk(async () => {
      return OK('new_data');
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current.v).toBe('new_data');
  });

  test('onEachAsArray() when return Result', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray((v) => {
      return OK(v);
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current).toEqual(OK([1, 2, 3]));
  });

  test('onEachAsArray() when return AsyncResult', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray((v) => {
      return OKA(v);
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current).toEqual(OK([1, 2, 3]));
  });

  test('onEachAsArray() when return Promise', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray(async (v) => {
      return OK(v);
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current).toEqual(OK([1, 2, 3]));
  });

  test('onEachAsArray() when return Error', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray((v) => {
      if (v === 2) {
        return ERR('test_error');
      }

      return OK(v);
    });

    expect(current.isError()).toBeTruthy();
    expect(current).toEqual(ERR('test_error'));
  });
});
