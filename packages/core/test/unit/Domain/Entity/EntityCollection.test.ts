import { ValueObject, UIntValue } from '@hexcore/common';
import { EntityCollection, EntityCollectionInterface, ENTITY_COLLECTIONS_META_PROPERTY, ROOT_ID_PROPERTY_META_PROPERTY } from '../../../../src';
import { EntityBase } from '../../../../src/Domain/Entity/EntityBase';

@ValueObject('Test')
class BookId extends UIntValue {}

class Book extends EntityBase<BookId> {
  public readonly authorId?: AuthorId;

  public constructor(public name: string) {
    super();
    return this.proxify();
  }
}

@ValueObject('Test')
class AuthorId extends UIntValue {}

class Author extends EntityBase<AuthorId> {
  @EntityCollection(Book)
  public readonly books: EntityCollectionInterface<Book>;

  public constructor(public name: string) {
    super();
    return this.proxify();
  }
}

describe('EntityCollection', () => {
  test('meta properties', () => {
    expect(Author[ENTITY_COLLECTIONS_META_PROPERTY]).toEqual({
      books: { entityClass: Book },
    });

    expect(Author[ROOT_ID_PROPERTY_META_PROPERTY]).toEqual('authorId');
  });

  test('add when author id undefined', () => {
    const author = new Author('test');

    const book = new Book('test');
    author.books.add(book);

    expect(book.authorId).toBe(author.id);
    expect(author.books.waitingAdd).toEqual([book]);
  });

  test('add when author has id', () => {
    const author = new Author('test');
    author.id = AuthorId.c(1).v;

    const book = new Book('test');
    author.books.add(book);

    expect(author.books.waitingAdd).toEqual([book]);
  });
});
