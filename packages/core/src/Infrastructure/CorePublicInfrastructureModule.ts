import { Module } from "@nestjs/common";
import { EtaTemplateService } from "./Template/EtaTemplateService";
import { MockMailingService } from './Mailing/MockMailingService';

export const ITemplateService = Symbol("TemplateService");
const TemplateServiceProvider = {
  provide: ITemplateService,
  useClass: EtaTemplateService
};

export const IMailingService = Symbol("MailingService");
const MailingServiceProvider = {
  provide: IMailingService,
  useClass: MockMailingService
};

@Module({
  providers: [TemplateServiceProvider, MailingServiceProvider],
  exports: [TemplateServiceProvider, MailingServiceProvider]
})
export class CorePublicInfrastructureModule {}
