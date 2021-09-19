import { Module } from '@nestjs/common';
import { CqrsModule } from "@nestjs/cqrs";
import { AbcPrivateInfrastructureModule } from '../Infrastructure/AbcPrivateInfrastructureModule';

const CommandHandlers = [

];

const EventHandlers = [

];

const QueryHandlers = [

];

const MessageHandlers = [
  ...CommandHandlers, ...EventHandlers, ...QueryHandlers,
];


@Module({
  imports: [
    CqrsModule,
    AbcPrivateInfrastructureModule
  ],
  exports: [
    CqrsModule,
    ...MessageHandlers
  ],
  providers: [
    ...MessageHandlers,
  ]
})
export class AbcPublicApplicationModule {}
