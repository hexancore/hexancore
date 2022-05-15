export class StringHelper {
  public static upperFirst(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  public static splitPascalCase(word: string): string[] {
    const wordRegex = /($[a-z])|[A-Z][^A-Z]+/g;
    return word.match(wordRegex);
  }
}
