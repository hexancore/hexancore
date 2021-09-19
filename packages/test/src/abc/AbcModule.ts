import { Module } from '@nestjs/common';
import { AbcPrivateApplicationModule } from './Application/AbcPrivateApplicationModule';
import { AbcPublicApplicationModule } from './Application/AbcPublicApplicationModule';

@Module({
  imports: [AbcPrivateApplicationModule, AbcPublicApplicationModule],
  exports: [AbcPublicApplicationModule],
  controllers: [],
})
export class AbcModule {}
