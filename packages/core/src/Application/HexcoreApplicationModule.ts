import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DefaultGeneralBus } from '@/Util/Cqrs/DefaultGeneralBus';
import { GeneralBus } from '@/Util/Cqrs/GeneralBus';

const GeneralBusProvider = {
  provide: GeneralBus,
  useClass: DefaultGeneralBus,
};

@Global()
@Module({
  imports: [CqrsModule],
  providers: [GeneralBusProvider],
  exports: [GeneralBusProvider],
})
export class HexcoreApplicationModule {}
