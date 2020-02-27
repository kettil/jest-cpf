import {
  mapPerLine,
  padLeft,
  formatPercent,
  padFill,
  padRight,
  cleanFileFromRootPath,
  cleanFileFromExtensions,
} from './string';

describe('cleanFileFromRootPath()', () => {
  test('it should work', () => {
    const result = cleanFileFromRootPath('/path/to/project/src/index.ts', '/path/to/project');

    expect(result).toBe('src/index.ts');
  });
});

describe('cleanFileFromExtensions()', () => {
  test('it should work', () => {
    const result = cleanFileFromExtensions('/path/to/project/src/index.ts');

    expect(result).toBe('/path/to/project/src/index.');
  });
});

describe('mapPerLine()', () => {
  test('it should work', () => {
    const result = mapPerLine('abc\n123\nabc', (s: string) => `[${s}]`);

    expect(result).toBe('[abc]\n[123]\n[abc]');
  });
});

describe('padFill()', () => {
  test('it should work with string length is smaller', () => {
    const result = padFill('abcdef', 10, ' ');

    expect(result).toBe('    ');
  });

  test('it should work with string length is greater', () => {
    const result = padFill('abcdef', 4, ' ');

    expect(result).toBe('');
  });

  test('it should work with string length is equal', () => {
    const result = padFill('abcdef', 6, ' ');

    expect(result).toBe('');
  });
});

describe('padLeft()', () => {
  test('it should work', () => {
    const result = padLeft('abcdef', 10, ' ');

    expect(result).toBe('    abcdef');
  });
});

describe('padRight()', () => {
  test('it should work', () => {
    const result = padRight('abcdef', 10, ' ');

    expect(result).toBe('abcdef    ');
  });
});

describe('formatPercent()', () => {
  const data: Array<[number, string]> = [
    [80, ' 80.00'],
    [5.7, '  5.70'],
    [100, '100.00'],
    [5.87, '  5.87'],
  ];

  test.each(data)('it should work with %p', (n, expected) => {
    const result = formatPercent(n);

    expect(result).toBe(expected);
  });
});
