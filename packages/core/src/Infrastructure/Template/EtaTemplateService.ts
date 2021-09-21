import { FilePath } from '@/Util';
import * as Eta from 'eta';
import * as Path from 'path';
import { TemplateService } from '../../Domain/Service/Template/TemplateService';

export class EtaTemplateService implements TemplateService {
  public constructor(private rootTemplateDir: string) {
    Eta.defaultConfig.async = true;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async render(source: string, data: object): Promise<string> {
    return Eta.render(Path.join(this.rootTemplateDir, source + '.eta'), data) as Promise<string>;
  }
}
