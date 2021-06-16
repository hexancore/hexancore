import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendTemplatedMailCommand } from './SendTemplatedEmailCommand';
import { MailingService } from '../../../../Domain/Service/MailingService';
import { TemplateService } from '../../../../Domain/Service/TemplateService';
import { MailContent } from '../../../../Domain/ValueObject/MailContent';
import { error, Result } from '../../../../Util/Result';
import * as fs from 'fs-extra';
import { Inject } from '@nestjs/common';
import { TemplateContentType } from '../../../../Domain/Dto/SendMailTemplateDto';
import { Email } from '../../../../Domain/ValueObject/Email';
import { FilePath } from '../../../../Util/FilePath';
import { ITemplateService, IMailingService } from '../../../../Infrastructure/CorePublicInfrastructureModule';
import { ConfigService } from '@nestjs/config';

@CommandHandler(SendTemplatedMailCommand)
export class SendTemplatedEmailHandler implements ICommandHandler<SendTemplatedMailCommand, Result<boolean>> {
  private templateService: TemplateService;
  private mailingService: MailingService;
  private config: ConfigService;

  public constructor(
    @Inject(ITemplateService) templateService: TemplateService,
    @Inject(IMailingService) mailingService: MailingService,
    config: ConfigService,
  ) {
    this.templateService = templateService;
    this.mailingService = mailingService;
    this.config = config;
  }

  public async execute(command: SendTemplatedMailCommand): Promise<Result<boolean>> {
    const content = await this.createMailContent(command);
    if (content.isError()) {
      return error({
        type: 'core.application.command.mailing.send_templated_mail.rendered_content_error',
        data: content.value.data,
      });
    }

    return this.mailingService.sendEmail({
      typeId: command.data.typeId,
      from: command.data.from ?? Email.create(this.config.get<string>("CORE_MAILING_FROM")).unwarp(),
      fromName: command.data.fromName ?? this.config.get<string>("CORE_MAILING_FROMNAME"),
      to: command.data.to,
      content: content.value,
    });
  }

  private async createMailContent(command: SendTemplatedMailCommand): Promise<Result<MailContent>> {
    const subject = await this.templateService.render(command.data.subject, command.templateData);

    const html = await this.templateService.render(await this.loadTemplate(command.data.html), command.templateData);
    const text = await this.templateService.render(await this.loadTemplate(command.data.text), command.templateData);
    return MailContent.create(subject, html, text);
  }

  private async loadTemplate(template: TemplateContentType): Promise<string> {
    if (template instanceof FilePath) {
      return (await fs.readFile(template.path)).toString('utf8');
    }

    if (template instanceof Buffer) {
      return template.toString('utf8');
    }

    return <string>template;
  }
}
