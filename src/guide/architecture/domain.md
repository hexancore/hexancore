---
layout: doc
title: Module Domain layer
---

# Module Domain Layer
Domain-Driven Design focuses on complexity management in software development by deeply connecting the implementation to an evolving model of the core business concepts. Haxancore might leverage DDD principles to guide the design and development of its systems, ensuring that the software accurately reflects and evolves with the business domain it represents.

Hexancore provides abstractions to separate any persistence technology(like `@typeorm` ) from Module Domain layer
for clean design and delay infrastructure decisions.

## Value Object
Is immutable byte, light-weight objects that don’t have any identity.
Value objects reduce complexity by performing complex calculations, isolating heavy computational logic from entities.

In package `@hexancore/common` you can find some basic Value objects implementation like `Email` and cool base to build custom one like `RegexStringValue`.

**Example**
```ts
import { UIntValue, ValueObject } from '@hexcore/common';

@ValueObject('Test')
export class AuthorId extends UIntValue<AuthorId> {}
```

## Aggregate Root
Aggregate is a cluster of domain objects that can be treated as a single unit.

```ts
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
// TODO

## Domain Service
// TODO

## Error
// TODO


