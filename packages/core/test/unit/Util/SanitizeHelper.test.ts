import { SanitizeHelper } from '../../../src/Util/SanitizeHelper';
/**
 * @group unit/core
 */

describe('SanitizeHelper', () => {
  test.each([
    [
      'Basic XSS Test Without Filter Evasion',
      '<SCRIPT SRC=http://xss.rocks/xss.js></SCRIPT>',
      '&lt;SCRIPT SRC=http://xss.rocks/xss.js&gt;&lt;/SCRIPT&gt;',
    ],
    [
      'XSS Locator (Polygot)',
      "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onmouseover=1/+/[*/[]/+alert(1)//'>",
      "javascript:/*--&gt;&lt;/title&gt;&lt;/style&gt;&lt;/textarea&gt;&lt;/script&gt;&lt;/xmp&gt;&lt;svg/onload='+/\"/+/onmouseover=1/+/[*/[]/+alert(1)//'&gt;",
    ],
    [
      'Image XSS Using the JavaScript Directive',
       '<IMG SRC="javascript:alert(\'XSS\');">',
       '<img src>'
      ],
    [
      'No Quotes and no Semicolon',
      "<IMG SRC=javascript:alert('XSS')>",
      '<img src>'
    ],
    [
      'Case Insensitive XSS Attack Vector',
      '<IMG SRC=JaVaScRiPt:alert(\'XSS\')>',
      '<img src>'
    ],
    [
      'HTML Entities',
      '<IMG SRC=javascript:alert(&quot;XSS&quot;)>',
      '<img src>'
    ],
  ])('sanitizeText() %s', (_name: string, value: string, expected: string) => {
    expect(SanitizeHelper.sanitizeText(value)).toBe(expected);
  });
});
