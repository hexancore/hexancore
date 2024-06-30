---
layout: doc
title: Module Domain
---

# Module Domain  <HcWipTag/>
Domain-Driven Design focuses on complexity management in software development by deeply connecting the implementation to an evolving model of the core business concepts. Haxancore might leverage DDD principles to guide the design and development of its systems, ensuring that the software accurately reflects and evolves with the business domain it represents.

Hexancore provides abstractions to separate any persistence technology(like `@typeorm` ) from Module Domain layer
for clean design and delay infrastructure decisions.

## Value Object
Is immutable byte, light-weight objects that don’t have any identity.
Value objects reduce complexity by performing complex calculations, isolating heavy computational logic from entities.

In package `@hexancore/common` you can find some basic Value objects implementation like `Email` and cool base to build custom one like `RegexStringValue`.

**Example**
```ts
// src/Bookstore/Domain/Author/AuthorId.ts
import { UIntValue, ValueObject } from '@hexcore/common';

@ValueObject('Test')
export class AuthorId extends UIntValue<AuthorId> {}
```

## Aggregate Root
Aggregate is a cluster of domain objects that can be treated as a single unit.

```ts
// src/Bookstore/Domain/Author/Author.ts
import { AbstractAggregateRoot, AggregateRoot, EntityCollection, IEntityCollection } from '@';
import { UIntValue, ValueObject } from '@hexancore/common';
import { Book } from './Book';

@AggregateRoot()
export class Author extends AbstractAggregateRoot<AuthorId> {
  @EntityCollection(Book)
  public declare readonly books: IEntityCollection<Book>;

  public constructor(public name: string) {
    super();
    return this.proxify();
  }
}
```

## Entity
Entity is a class that has some business logic properties(most of them will be ValueObjects), identity property and relation to AggregateRoot.
In short, an entity implements some business logic and could be uniquely identified using an id and aggregateRootId.
In context of programming, it generally persisted in some form in DB and it consists of value objects.

**Example**
```ts
// src/Bookstore/Domain/Author/Book.ts
import { Entity, AbstractEntity} from '@';
import { UIntValue, ValueObject } from '@hexancore/common';
import { Author, AuthorId } from './Author';

@Entity()
export class Book extends AbstractEntity<BookId, Author> {

  public readonly authorId?: AuthorId;

  public constructor(public name: string) {
    super();
    return this.proxify();
  }
}
```

## Repository
Repository acts as an interface to the collection of domain objects, abstracting the details of data access and storage.

It provides a clean separation between the domain logic and data persistence mechanisms, allowing for more flexible data management and easier testing of the domain logic without worrying about the database interactions.

Only AggregateRoot can have public interface in Module Domain Layer, entities can be managed only by AggregateRoot.

::: code-group
```ts [AggregateRootRepository Interface]
// src/Bookstore/Domain/Author/AuthorRepository.ts
interface AuthorRepository extends IAggregateRootRepository<Author> {}
```

```ts [EntityRepository Implementation]
// src/Bookstore/Infrastructure/Persistance/Domain/Author/MemoryBookReposiotry.ts
@EntityRepository(Book, 'memory')
export class MemoryBookRepository extends MemoryEntityRepository<Book> {}
```

```ts [AggregateRootRepository Implementation]
// src/Bookstore/Infrastructure/Persistance/Domain/Author/MemoryAuthorReposiotry.ts
@AggregateRootRepository(Author, 'memory')
export class MemoryAuthorRepository extends MemoryAggregateRootRepository<Author> implements AuthorRepository {}
```
:::

## Domain Service
A Domain Service in the Module Domain Layer encapsulates business logic that doesn't naturally fit within a single entity or value object, often coordinating tasks across multiple domain models.

This service is crucial for handling complex business rules and operations that are specific to the domain, ensuring that the business logic remains clean and maintainable.


## Error
// TODO


