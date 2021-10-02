import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GeneralBus } from '@';
import { DefaultGeneralBus } from '@/Util/Cqrs/DefaultGeneralBus';

const GeneralBusProvider = {
  provide: GeneralBus,
  useClass: DefaultGeneralBus,
};

@Global()
@Module({
  imports: [CqrsModule],
  providers: [GeneralBusProvider],
  exports: [ CqrsModule, GeneralBusProvider],
})
export class HexcoreApplicationModule {}
