import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EtaTemplateService } from './Template/EtaTemplateService';
import { MockMailingService } from './Mailing/MockMailingService';

export const ITemplateService = Symbol('TemplateService');
const DefaultTemplateServiceProvider = {
  provide: ITemplateService,
  useClass: EtaTemplateService,
};

export const IMailingService = Symbol('MailingService');
const DefaultMailingServiceProvider = {
  provide: IMailingService,
  useClass: MockMailingService,
};

export interface CorePublicInfrastructureModuleOptions {
  MailingServiceProvider?: Provider;
  TemplateServiceProvider?: Provider;
}

@Module({})
export class HexcorePublicInfrastructureModule {
  static register(options: CorePublicInfrastructureModuleOptions): DynamicModule {
    const providers = [
      options.TemplateServiceProvider ?? DefaultTemplateServiceProvider,
      options.MailingServiceProvider ?? DefaultMailingServiceProvider,
    ];
    return {
      module: HexcorePublicInfrastructureModule,
      providers: providers,
      exports: providers,
    };
  }
}
