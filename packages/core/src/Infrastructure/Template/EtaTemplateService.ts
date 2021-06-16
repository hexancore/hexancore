import * as Eta from 'eta';
import { TemplateService } from '../../Domain/Service/TemplateService';

export class EtaTemplateService implements TemplateService {
  public constructor() {
    Eta.defaultConfig.async = true;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async render(source: string, data: object): Promise<string> {
    return Eta.render(source, data) as Promise<string>;
  }
}
