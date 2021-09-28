import { FilePath } from '@/Util';
import * as Eta from 'eta';
import * as Path from 'path';
import * as fs from 'fs-extra';
import { TemplateService, TemplateContentType } from '../../Domain/Service/Template/TemplateService';


export class EtaTemplateService implements TemplateService {
  public constructor(private rootTemplateDir: string) {
    Eta.defaultConfig.async = true;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async render(source: TemplateContentType, data: object): Promise<string> {
    return Eta.render(await this.loadTemplate(source), data) as Promise<string>;
  }

  private async loadTemplate(template: TemplateContentType): Promise<string> {
    if (template instanceof FilePath) {
      return (await fs.readFile(Path.join(this.rootTemplateDir, template.path + ".eta"))).toString('utf8');
    }

    if (template instanceof Buffer) {
      return template.toString('utf8');
    }

    return <string>template;
  }
}
