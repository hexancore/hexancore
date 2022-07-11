/**
 * @group integration
 */

import { AsyncResult, ValueObject, UIntValue, ImmutableDate, DefineDomainErrors, ERR, standard_entity_error_types, P, OK } from '@hexcore/common';
import {
  HexcoreModule,
  EntityBase,
  EntityCollection,
  EntityCollectionInterface,
  EntityCollectionImpl,
  AggregateRootRepositoryInterface,
  Entity,
  AggregateRoot,
} from '@hexcore/core';
import { Injectable, Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { InjectEntityManager, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager, EntitySchema } from 'typeorm';
import { MySqlTestingModule } from '../../src/Test/TypeOrmTestHelper';
import { UIntValueColumn } from '../../src/Schema/ValueObject/UIntValueColumn';
import { ImmutableDateColumn, AbstractTypeOrmEntityRepository } from '@';
import { TypeOrmAggregateRootRepository, TypeOrmEntityRepository } from '@/Repository/TypeOrmEntityRepositoryDecorator';
import { AbstractTypeOrmAggregateRootRepository } from '@/Repository/AbstractTypeOrmAggregateRootRepository';
import { TypeOrmEntitySchema } from '@/Schema/TypeOrmEntitySchema';

@ValueObject('Test')
class BookId extends UIntValue {}

@Entity('Test')
class Book extends EntityBase<BookId> {
  public readonly authorId: AuthorId;
  public readonly createdAt: ImmutableDate;

  public constructor(public name: string) {
    super();
    return this.proxify();
  }
}

@ValueObject('Test')
class AuthorId extends UIntValue {}

@AggregateRoot('Test')
class Author extends EntityBase<AuthorId> {
  @EntityCollection(Book)
  public declare readonly books: EntityCollectionInterface<Book>;

  public constructor() {
    super();
    return this.proxify();
  }
}

const BookSchema = TypeOrmEntitySchema<Book>(Book, {
  columns: {
    id: UIntValueColumn.asPrimaryKey(BookId),
    authorId: UIntValueColumn.as(AuthorId, { type: 'smallint' }),
    name: {
      type: 'varchar',
      length: 255,
    },
    createdAt: ImmutableDateColumn.asSelf(),
  },
});

const AuthorSchema = TypeOrmEntitySchema<Author>(Author, {
  columns: {
    id: UIntValueColumn.asPrimaryKey(AuthorId),
  },
});

const TestDomainError = DefineDomainErrors(
  'Test',
  new (class {
    entity_book: standard_entity_error_types = 'not_found';
    entity_author: standard_entity_error_types | 'custom_1' = 'not_found';
    other_error = '';
  })(),
);

@TypeOrmEntityRepository({moduleName: 'Test', rootEntityClass: Author, entitySchema: BookSchema, rootCollectionProperty: "books"})
@Injectable()
class TypeOrmBookRepository extends AbstractTypeOrmEntityRepository<Book, BookId, Author, AuthorId> {
  protected getDomainErrors(): Object {
    return TestDomainError;
  }
}

interface AuthorRepository extends AggregateRootRepositoryInterface<Author, AuthorId> {}

@TypeOrmAggregateRootRepository('Test', AuthorSchema)
@Injectable()
class TypeOrmAuthorRepository extends AbstractTypeOrmAggregateRootRepository<Author, AuthorId> implements AuthorRepository {
  private readonly bookRepository: TypeOrmBookRepository;

  public constructor(@InjectEntityManager() em: EntityManager) {
    super(em);
    this.bookRepository = new TypeOrmBookRepository(em);
  }

  public persist(entity: Author | Author[]): AsyncResult<boolean> {
    return super.persist(entity).onOk(() => {
      return this.bookRepository.persistCollectionFromRoot(entity);
    });
  }

  public getAll(): AsyncResult<Iterable<Author>> {
    return super.getAll().map((authors: Author[]) => {
      this.bookRepository.injectCollectionQueries(authors);
      return authors;
    });
  }

  protected getDomainErrors(): Object {
    return TestDomainError;
  }
}

const SAuthorRepository = Symbol('AuthorRepository');
const AuthorRepositoryProvider: Provider<TypeOrmAuthorRepository> = {
  provide: SAuthorRepository,
  useExisting: TypeOrmAuthorRepository,
};

describe('TypeOrmEntityRepository', () => {
  let module: TestingModule;
  let authorRepository: AuthorRepository;

  beforeEach(async () => {
    module = await MySqlTestingModule({
      imports: [HexcoreModule, TypeOrmModule.forFeature([AuthorSchema, BookSchema])],
      providers: [AuthorRepositoryProvider, TypeOrmAuthorRepository],
    });

    authorRepository = await module.get(SAuthorRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  test('persist()', async () => {
    const author = new Author();

    const book = new Book('test');
    author.books.add(book);

    let rp = await authorRepository.persist(author);
    expect(rp).toEqual(OK(true));

    const r = await authorRepository.getAllAsArray();
    expect(r.isSuccess()).toBeTruthy();

    expect(r.v[0].id).toEqual(author.id);

    const abr = await r.v[0].books.getAllAsArray();
    expect(abr.isSuccess()).toBeTruthy();
    const ab = abr.v;
    expect(ab.length).toBe(1);
    expect(ab[0]).toEqual(book);
  });

  test('getById() when not exists', async () => {
    const id = AuthorId.cs(1);
    const r = await authorRepository.getById(id);

    const expectedError = ERR({
      type: 'test.domain.entity.author.not_found',
      code: 404,
      data: {
        searchCriteria: {
          id,
        },
      },
    });
    expect(r).toEqual(expectedError);
  });
});
