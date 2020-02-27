import { ThresholdGroupType } from '../types';
import { isSuccess, evaluationFileStatus, evaluationFile, evaluationFiles } from './evaluation';

describe('isSuccess()', () => {
  const data: Array<[number, number, number, boolean]> = [
    [70, 0, 80, false],
    [90, 0, 80, true],
    [80, 0, 80, true],
    [0, 7, -5, false],
    [0, 3, -5, true],
    [0, 5, -5, true],
  ];

  test.each(data)('it should work with %p, %p and %p', (percent, lines, limit, expected) => {
    const result = isSuccess(percent, lines, limit);

    expect(result).toBe(expected);
  });
});

describe('evaluationFileStatus()', () => {
  test('it should work with under the limit', () => {
    const threshold = { percent: 80, uncovered: 7 };

    const result = evaluationFileStatus(threshold, 90);

    expect(result).toBe('error');
  });

  test('it should work with over the limit', () => {
    const threshold = { percent: 80, uncovered: 7 };

    const result = evaluationFileStatus(threshold, 70);

    expect(result).toBe('success');
  });

  test('it should work with error', () => {
    const threshold = 'ERROR';

    const result = evaluationFileStatus(threshold, 80);

    expect(result).toBe('error');
  });
});

describe('evaluationFile()', () => {
  let threshold: ThresholdGroupType;

  beforeEach(() => {
    threshold = {
      file: '/path/to/file.ts',
      threshold: {
        statements: { percent: 90, uncovered: 7 },
        branches: { percent: 90, uncovered: 7 },
        functions: { percent: 90, uncovered: 7 },
        lines: { percent: 90, uncovered: 7 },
      },
    };
  });

  test('it should work with success', () => {
    const limit = { statements: 90, branches: 90, functions: -10, lines: -10 };

    const result = evaluationFile(threshold, limit);

    expect(result).toBe('success');
  });

  test('it should work with error', () => {
    const limit = { statements: 90, branches: 50, functions: -5, lines: -10 };

    const result = evaluationFile(threshold, limit);

    expect(result).toBe('error');
  });
});

describe('evaluationFiles()', () => {
  test('it should work', () => {
    const limit = { statements: 90, branches: 90, functions: -10, lines: -10 };
    const thresholds = [
      {
        file: '/path/to/file.ts',
        threshold: {
          statements: { percent: 90, uncovered: 7 },
          branches: { percent: 90, uncovered: 7 },
          functions: { percent: 90, uncovered: 7 },
          lines: { percent: 90, uncovered: 7 },
        },
      },
      {
        file: '/path/to/file.ts',
        threshold: {
          statements: { percent: 90, uncovered: 5 },
          branches: { percent: 90, uncovered: 3 },
          functions: { percent: 90, uncovered: 14 },
          lines: { percent: 90, uncovered: 6 },
        },
      },
    ];

    const result = evaluationFiles(thresholds, limit);

    expect(result).toEqual({ error: 1, success: 1 });
  });
});
