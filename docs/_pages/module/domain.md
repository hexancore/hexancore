---
layout: page
title: Domain
permalink: /module/domain
parent: Module
nav_order: 1
---

# Intro
Hexcore is based on DDD concept for build better extendable and maintainable software.

## Value Object
Is immutable byte, light-weight objects that don’t have any identity.

Value objects reduce complexity by performing complex calculations, isolating heavy computational logic from entities.

In package `@hexcore/common` you can find some basic Value objects implementation like `Email` and cool base to build custom one like `RegexStringValue`.

**Example**
```ts
import { UIntValue, ValueObject } from '@hexcore/common';

@ValueObject('Player') // 'Player' is module name where value object will be belong
export class PlayerId extends UIntValue<PlayerId> {}
```

## Aggregate Root
Aggregate is a cluster of domain objects that can be treated as a single unit.

```ts
@AggregateRoot('Game')
export class Player extends EntityBase<PlayerId> {
  @EntityCollection(PlayerScore)
  public declare readonly scores: EntityCollectionInterface<PlayerScore>;
  public readonly createdAt?: ImmutableDate;

  public constructor() {
    super();
    return super.proxify();
  }

  public toDto(): PlayerDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
    };
  }
}
```

## Entity
Entity is a class that has some business logic properties(most of them can be ValueObjects) and global identity property.

Remember there can be a change in state of property but identity never changes.

In short, an entity implements some business logic and could be uniquely identified using an ID.

In context of programming, it generally persisted as a row in DB and it consists of value objects.

**Important for design**
Entity in `Domain` directory of module(read more about modules [here](/hexagonal_module)) must be not polluted with specify persistance packages stuff like `@typeorm` decorators for maximum transparency.
`EntityBase` from `@hexcore/core` can be used for tracking changes of properties.
That information is useful when you are not using orm/odm with support tracking changes in objects.

**Example**
```ts
@Entity('Game')
export class PlayerScore extends EntityBase<PlayerScoreId> {
  public readonly playerId?: PlayerId;
  public readonly createdAt?: ImmutableDate;

  public constructor(
    public readonly points: number,
  ) {
    super();
    return super.proxify();
  }

  public toDto(): PlayerScoreDto {
    return PlayerScoreDto.cs({
      id: this.id,
      points: this.points,
      playerId: this.playerId,
      createdAt: this.createdAt,
    });
  }
}
```
## Repository
// TODO

## Domain Service
// TODO

## Error
// TODO


