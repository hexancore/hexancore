/**
 * @group integration
 */

import { fromPromise, AsyncResult, ValueObject, IntegerIdValue } from '@hexcore/common';
import { HexcoreModule, ModuleEntityRepositoryInterface } from '@hexcore/core';
import { Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema } from 'typeorm';

import { createMySqlTestingModule } from '../../src/Test/TypeOrmTestHelper';
import { AbstractTypeOrmModuleEntityRepository, TypeOrmModuleEntityRepository } from '../../src/EntityRepository';
import { IntegerIdValueTransformer } from '../../src/Transformer/ValueObject/IntegerIdValueTransformer';

@ValueObject('Test')
class TestId extends IntegerIdValue<TestId> {}

class TestEntity {
  public constructor(public readonly id: TestId = null) {}
}

export const TestEntitySchema = new EntitySchema<TestEntity>({
  name: 'TestEntity',
  target: TestEntity,
  tableName: 'TestEntities',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
      transformer: IntegerIdValueTransformer<TestId>(TestId),
    },
  },
});

interface TestEntityRepository extends ModuleEntityRepositoryInterface<TestEntity, TestId> {
  persist(entity: TestEntity): AsyncResult<boolean>;
  getAll(): AsyncResult<Iterable<TestEntity>>;
}

@TypeOrmModuleEntityRepository('Test', TestEntitySchema)
class MySqlTestEntityRepository extends AbstractTypeOrmModuleEntityRepository<TestEntity, TestId> implements TestEntityRepository {
}

export const STestEntityRepository = Symbol('TestEntityRepository');

export const TestEntityRepositoryProvider: Provider<MySqlTestEntityRepository> = {
  provide: STestEntityRepository,
  useExisting: MySqlTestEntityRepository,
};

describe('EntityRepository', () => {
  let module: TestingModule;
  let repository: TestEntityRepository;

  beforeEach(async () => {
    module = await createMySqlTestingModule({
      imports: [HexcoreModule, TypeOrmModule.forFeature([MySqlTestEntityRepository])],
      providers: [TestEntityRepositoryProvider],
    });

    repository = await module.get(STestEntityRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  test('persist()', async () => {
    const entity = new TestEntity();

    await repository.persist(entity);
    expect(entity.id).toEqual(TestId.c(1).v);

    const r = await repository.getAll().map(Array.from);
    expect(r.isSuccess()).toBeTruthy();
    expect(r.v).toEqual([entity]);
  });

  test('getById() when not exists', async () => {
    const r = await repository.getById(TestId.c(1).v);

    expect(r.isError()).toBeTruthy();
  });
});
