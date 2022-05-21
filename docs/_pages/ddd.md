---
layout: page
title: Domain Driven Design
permalink: /ddd
nav_order: 3
---

# Intro
Hexcore is based on DDD concept for build better extendable and maintainable software.

## Value Object
Is immutable byte, light-weight objects that don’t have any identity.

Value objects reduce complexity by performing complex calculations, isolating heavy computational logic from entities.

In package `@hexcore/common` you can find some basic Value objects implementation like `Email` and cool base to build custom one like `RegexStringValue`.

**Example**
```ts
import { IntegerIdValue, ValueObject } from '@hexcore/common';

@ValueObject('Player') // 'Player' is module name where value object will be belong
export class PlayerId extends IntegerIdValue<PlayerId> {}
```

## Entity
Entity is a class that has some business logic properties(most of them can be ValueObjects) and global identity property.

Remember there can be a change in state of property but identity never changes.

In short, an entity implements some business logic and could be uniquely identified using an ID.

In context of programming, it generally persisted as a row in DB and it consists of value objects.

**Important for design**
Entity in `Domain` directory of module(read more about modules [here](/hexagonal_module)) must be not polluted with specify persistance packages stuff like `@typeorm` decorators for maximum transparency

**Example**
```ts
export class Post {
  public constructor(
    public ?id: PostId = null,
    public readonly userId: UserId,
    public readonly createdAt: ImmutableDate,
    public description: PostDescription,
  ) {}

  // some business logic methods
}
```

### Entity helper class
`Entity` from `@hexcore/core` can be used for tracking changes of properties. That information is useful when you are not using orm/odm with support tracking changes in objects.

**Example**
```ts
export class Post extends Entity<PostId> {
  public constructor(
    id: PostId = null,
    public readonly userId: UserId,
    public readonly createdAt: ImmutableDate,
    public description: PostDescription,
  ) {
    super(id);
    return super.proxify();
  }

  public static createNew(userId: UserId, description: PostDescription): Post {
    return new Post(null, userId, ImmutableDate.now(), description);
  }

  public toReadDto(): ReadPostDto {
    return {
      id: this.id,
      userId: this.userId,
      createdAt: this.createdAt,
      description: this.description,
    };
  }
```
## Repository
// TODO

## Error
Package `` contains some stuff to support domain errors obect generate like `NotFoundEntityError()` used with implementations of repository.

```ts
function NotFoundEntityError(module: string, entityType: string, searchCriteria: Record<string, any>): AppError;

NotFoundEntityError('Player', 'Player', {id: searchedId});
```

