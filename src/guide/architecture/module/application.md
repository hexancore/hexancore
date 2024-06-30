---
layout: doc
title: Module Application
---

# Module Application <HcWipTag/>

In the Hexancore, Module Application Layer acts as a crucial mediator, facilitating interactions between the domain logic and the outside world, including other modules within same application. This setup enhances the separation of concerns and scalability.
CQRS implementation is based on standard NestJS CQRS package(https://docs.nestjs.com/recipes/cqrs).

## Command

Command acts as a directive to modify the internal state of an application, channeling all write operations through the application layer to ensure the core domain remains isolated from external concerns and influences.

This encapsulation helps maintain the integrity and the principle of single responsibility within the architecture.

::: code-group
```ts [Command]
// Game/Application/Command/Player/PlayerRegisterCommand.ts

export class PlayerRegisterCommand {
  public constructor(public readonly name: string) {}
}
```
```ts [CommandHandler]
// Game/Application/Command/Player/PlayerRegisterCommandHandler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ARP } from '@hexancore/common';
import { PlayerRegisterCommand } from './PlayerRegisterCommand';
import { PlayerRepository } from '@/Game/Domain/Player/PlayerRepository';
import { Inject } from '@nestjs/common';
import { Player } from '@/Game/Domain/Player/Player';
import { PlayerId } from '@app/shared';

@CommandHandler(PlayerRegisterCommand)
export class PlayerRegisterCommandHandler implements ICommandHandler<PlayerRegisterCommand> {
  public constructor(private repositoryManager: AggregateRootRepositoryManager) {}

  public execute(command: PlayerRegisterCommand): ARP<PlayerId> {
    const entity = Player.create(command.name);
    return this.getRepository().persist(entity).onOK(() => entity.id).p;
  }

  private getRepository(): PlayerRepository {
    return this.repositoryManager.get(Player);
  }
}
```
:::

## Query

Query is used to request data from the application without affecting its state, ensuring a clear separation from commands which alter data.

This separation allows for optimized and efficient data retrieval mechanisms that interact with the application's core through defined ports, maintaining the integrity and isolation of the domain model.

::: code-group
```ts [Query]
// Game/Application/Command/Player/PlayerGetByDiscordUserIdQuery.ts
import { DiscordUserId } from '@app/shared';

export class PlayerGetByDiscordUserIdQuery {
  public constructor(public readonly discordUserId: DiscordUserId) {}
}
```
```ts [QueryHandler]
// Game/Application/Command/Player/PlayerGetByDiscordUserIdQueryHandler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ARP } from '@hexancore/common';
import { PlayerGetByDiscordUserIdQuery } from './PlayerGetByDiscordUserIdQuery';
import { PlayerRepository } from '@/Game/Domain/Player/PlayerRepository';
import { Inject } from '@nestjs/common';
import { Player } from '@/Game/Domain/Player/Player';
import { PlayerId } from '@app/shared';

@QueryHandler(PlayerGetByDiscordUserIdQuery)
export class PlayerGetByDiscordUserIdQueryHandler implements IQueryHandler<PlayerGetByDiscordUserIdQuery> {
  public constructor(private repositoryManager: AggregateRootRepositoryManager) {}
  public execute(query: PlayerGetByDiscordUserIdQuery): ARP<PlayerDto> {
    return this.getRepository().getByDiscordUserId(query.discordUserId).onOK((p: Player) => p.toDto()).p;
  }

  private getRepository(): PlayerRepository {
    return this.repositoryManager.get(Player);
  }
}
```
:::

## Aplication Service

In Hexancore, an Application Service acts as a mediator that orchestrates operations between the external interfaces(via Ports&Adapters Pattern) and other module application layer and domain layer components. It handles complex business workflows, enforces rules, and coordinates transactions, providing a simplified, consistent access point to the core business logic.

::: code-group
```ts [Service Interface]
// src/Game/Application/Service/Level/LevelSentenceGenerator.ts
import { GameLevelInfo } from '@app/shared';
import { AR } from '@hexancore/common';

export const SLevelSentenceGenerator = Symbol('Game_LevelSentenceGenerator');

export interface LevelSentenceGenerator {
  getText(levelInfo: GameLevelInfo): string;
  generateImage(levelInfo: GameLevelInfo, levelName: string): AR<boolean>;
  getImageUrl(levelInfo: GameLevelInfo): string;
}
```

```ts [Service Implementation]
// src/Game/Infrastructure/Service/Level/InfraLevelSentenceGenerator.ts
import { GameLevelInfo } from '@app/shared';
import { AR, OKA } from '@hexancore/common';

export class InfraLevelSentenceGenerator implements LevelSentenceGenerator {

  public getText(levelInfo: GameLevelInfo): string {
    return "text";
  }

  public generateImage(levelInfo: GameLevelInfo, levelName: string): AR<boolean> {
    return OKA(true);
  }

  public getImageUrl(levelInfo: GameLevelInfo): string {
    return "https://google.com"
  }
}
```
:::

## CLI

With `hcli` creating commands/queries and other elements is easier.

Try use:

```bash
hcli make message
```