import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostCreate5Command } from './PostCreate5Command';

@CommandHandler(PostCreate5Command)
export class PostCreate5CommandHandler implements ICommandHandler<PostCreate5Command> {
  public constructor() {}

  public execute(command: PostCreate5Command): Promise<Result<boolean>> {
    // TODO: need implementation
  }
}