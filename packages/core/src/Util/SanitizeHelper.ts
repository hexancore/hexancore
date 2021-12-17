
import xss from 'xss';

export class SanitizeHelper {
  public static sanitizeText(dirty: string): string {
    return xss(dirty);
  }
}
