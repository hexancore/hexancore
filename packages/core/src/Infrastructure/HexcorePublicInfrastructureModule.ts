import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EtaTemplateService } from './Template/EtaTemplateService';
import { MockMailingService } from './Mailing/MockMailingService';

export const ITemplateService = Symbol('TemplateService');
export const IMailingService = Symbol('MailingService');
const DefaultMailingServiceProvider = {
  provide: IMailingService,
  useClass: MockMailingService,
};

export interface CorePublicInfrastructureModuleOptions {
  MailingServiceProvider?: Provider;
  TemplateServiceProvider?: Provider;
  DefaultTemplateServiceProviderOptions?: {
    templateRootDir: string;
  };
}

@Module({})
export class HexcorePublicInfrastructureModule {
  public static register(options: CorePublicInfrastructureModuleOptions): DynamicModule {

    const providers = [
      options.TemplateServiceProvider ?? {
        provide: ITemplateService,
        useValue: new EtaTemplateService(options.DefaultTemplateServiceProviderOptions.templateRootDir)
      },
      options.MailingServiceProvider ?? DefaultMailingServiceProvider,
    ];
    return {
      module: HexcorePublicInfrastructureModule,
      providers: providers,
      exports: providers,
    };
  }
}
