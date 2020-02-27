import { ThresholdGroupType } from '../types';
import sort from './sort';

describe('sort()', () => {
  const data: Array<[string, string, number]> = [
    ['/path/to/abc.ts', '/path/to/abb.ts', 1],
    ['/path/to/abc.ts', '/path/to/abc.ts', 0],
    ['/path/to/abc.ts', '/path/to/abd.ts', -1],

    ['/path/to2/abc.ts', '/path/to1/abc.ts', 1],
    ['/path/to2/abc.ts', '/path/to3/abd.ts', -1],
  ];

  test.each(data)('it should work with %p and %p', (fileA, fileB, expected) => {
    const a = { file: fileA } as ThresholdGroupType;
    const b = { file: fileB } as ThresholdGroupType;

    const result = sort(a, b);

    expect(result).toBe(expected);
  });
});
