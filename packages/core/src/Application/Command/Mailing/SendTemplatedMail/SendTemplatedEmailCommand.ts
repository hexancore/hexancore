import { SendMailTemplateDto } from '../../../../Domain/Dto/SendMailTemplateDto';
import { ICommand } from '@nestjs/cqrs';

export class SendTemplatedMailCommand implements ICommand {
  // eslint-disable-next-line @typescript-eslint/ban-types
  public constructor(public readonly data: SendMailTemplateDto, public readonly templateData: object) {}
}
