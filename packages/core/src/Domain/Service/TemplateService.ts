export interface TemplateService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  render(source: string, data: object): Promise<string>;
}
