import { FilePath } from '../../../Util/FilePath';

export type TemplateContentType = string | FilePath | Buffer;

export interface TemplateService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  render(source: TemplateContentType, data: object): Promise<string>;
}
