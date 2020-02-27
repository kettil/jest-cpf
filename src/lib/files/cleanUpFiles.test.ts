import { JestConfigType } from '../types';
import cleanUpFiles, { cleanUpByPatterns, cleanUpByFiles } from './cleanUpFiles';

describe('cleanUpByPatterns()', () => {
  let patterns: string[];
  let files: string[];
  let path: string;

  beforeEach(() => {
    path = '/lib';
    patterns = ['/__mock__/', '<rootDir>/tools'];
    files = ['/lib/__mock__/file1.ts', '/lib/helper/file2.ts', '/lib/tools/file3.ts', '/lib/src/file4.ts'];
  });

  test('it should work with files', () => {
    const result = cleanUpByPatterns(files, patterns, path);

    expect(result).toEqual(['/lib/helper/file2.ts', '/lib/src/file4.ts']);
  });

  test('it should work with files and without patterns', () => {
    const result = cleanUpByPatterns(files, [], path);

    expect(result).toEqual([
      '/lib/__mock__/file1.ts',
      '/lib/helper/file2.ts',
      '/lib/tools/file3.ts',
      '/lib/src/file4.ts',
    ]);
  });

  test('it should work without test files', () => {
    const result = cleanUpByPatterns([], patterns, path);

    expect(result).toEqual([]);
  });

  test('it should work without test files and patterns', () => {
    const result = cleanUpByPatterns([], [], path);

    expect(result).toEqual([]);
  });
});

describe('cleanUpByFiles()', () => {
  let testFiles: string[];
  let files: string[];

  beforeEach(() => {
    testFiles = ['/src/lib/file1.test.ts', '/src/lib/file3.test.ts'];
    files = ['/src/lib/file1.test.ts', '/src/lib/file1.ts', '/src/lib/file2.ts'];
  });

  test('it should work with files', () => {
    const result = cleanUpByFiles(files, testFiles);

    expect(result).toEqual(['/src/lib/file1.ts', '/src/lib/file2.ts']);
  });

  test('it should work without files', () => {
    const result = cleanUpByFiles([], []);

    expect(result).toEqual([]);
  });
});

describe('cleanUpFiles()', () => {
  test('it should work', () => {
    const files = ['/src/lib/file1.test.ts', '/src/lib/file.ts', '/src/lib/__mock__/file.ts'];
    const testFiles = ['/src/lib/file1.test.ts', '/src/lib/file3.test.ts'];
    const config = {
      rootDir: '/path/to/projekt',
      coveragePathIgnorePatterns: ['/__mock__/'],
    } as JestConfigType;

    const result = cleanUpFiles(files, testFiles, config);

    expect(result).toEqual(['/src/lib/file.ts']);
  });
});
