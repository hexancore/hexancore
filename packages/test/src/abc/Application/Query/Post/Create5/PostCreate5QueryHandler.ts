import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { PostCreate5Query } from './PostCreate5Query';

@QueryHandler(PostCreate5Query)
export class PostCreate5QueryHandler implements IQueryHandler<PostCreate5Query> {
  public constructor() {}

  public execute(query: PostCreate5Query): Promise<Result<boolean>> {
    // TODO: need implementation
  }
}