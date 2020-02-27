import { readJsonFile } from '../files/json';
import { JestConfigType } from '../types';
import extract, { getSummaryObject } from './extract';

jest.mock('../files/json');

const readJsonFileMock = readJsonFile as jest.Mock;

describe('getSummaryObject()', () => {
  test('it should work with summary object', () => {
    const result = getSummaryObject({ statements: { pct: 10, total: 12, covered: 8 } }, 'statements');

    expect(result).toEqual({ covered: 8, pct: 10, total: 12 });
  });

  test('it should work without summary object', () => {
    const result = getSummaryObject({ statements: { pct: 10, total: 12 } }, 'statements');

    expect(result).toBeUndefined();
  });

  test('it should work without object', () => {
    const result = getSummaryObject('object', 'statements');

    expect(result).toBeUndefined();
  });
});

describe('extract()', () => {
  let json: {};

  beforeEach(() => {
    json = {
      total: {
        lines: { total: 10, covered: 10, skipped: 0, pct: 100 },
        statements: { total: 12, covered: 12, skipped: 0, pct: 100 },
        functions: { total: 7, covered: 7, skipped: 0, pct: 100 },
        branches: { total: 2, covered: 2, skipped: 0, pct: 100 },
      },
      '/path/to/project/src/lib/app.ts': {
        lines: { total: 10, covered: 10, skipped: 0, pct: 100 },
        functions: { total: 7, covered: 7, skipped: 0, pct: 100 },
        statements: { total: 12, covered: 12, skipped: 0, pct: 100 },
        branches: { total: 2, covered: 2, skipped: 0, pct: 100 },
      },
      '/path/to/project/src/lib/appB.ts': {
        lines: { total: 10, covered: 10, skipped: 0, pct: 100 },
        functions: { total: 7, covered: 7, skipped: 0, pct: 100 },
        statements: { total: 12, covered: 12, skipped: 0, pct: 100 },
        branches: { total: 2, covered: 2, skipped: 0, pct: 100 },
      },
      '/path/to/project/src/lib/faulty.ts': {
        lines: { total: 10, covered: 10, skipped: 0, pct: 100 },
        functions: { total: 7, covered: 7, skipped: 0, pct: 100 },
        statements: { total: 12, skipped: 0, pct: 100 },
        branches: { total: 2, covered: 2, skipped: 0, pct: 100 },
      },
    };
  });

  test('it should work with summary', async () => {
    const testFile = 'src/lib/app.test.ts';
    const config = {
      rootDir: '/path/to/project',
      roots: ['/src'],
    } as JestConfigType;

    readJsonFileMock.mockResolvedValue(json);

    const promise = extract('', testFile, config);

    await expect(promise).resolves.toEqual([
      {
        file: 'src/lib/app.ts',
        threshold: {
          branches: { percent: 100, uncovered: 0 },
          functions: { percent: 100, uncovered: 0 },
          lines: { percent: 100, uncovered: 0 },
          statements: { percent: 100, uncovered: 0 },
        },
      },
    ]);
  });

  test('it should work with faulty summary', async () => {
    const testFile = 'src/lib/faulty.test.ts';
    const config = {
      rootDir: '/path/to/project',
      roots: ['/src'],
    } as JestConfigType;

    readJsonFileMock.mockResolvedValue(json);

    const promise = extract('', testFile, config);

    await expect(promise).resolves.toEqual([
      {
        file: 'src/lib/faulty.ts',
        threshold: {
          branches: { percent: 100, uncovered: 0 },
          functions: { percent: 100, uncovered: 0 },
          lines: { percent: 100, uncovered: 0 },
          statements: 'ERROR',
        },
      },
    ]);
  });
});
