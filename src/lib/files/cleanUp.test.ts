import { cleanUpByPatterns, cleanUpByFiles } from './cleanUp';

describe('check the function cleanUpByPatterns()', () => {
  let patterns: string[];
  let files: string[];
  let path: string;

  beforeEach(() => {
    path = '/lib';
    patterns = ['/__mock__/', '<rootDir>/tools'];
    files = ['/lib/__mock__/file1.ts', '/lib/helper/file2.ts', '/lib/tools/file3.ts', '/lib/src/file4.ts'];
  });

  test('it should return an empty file list when the file and the pattern array is empty', () => {
    const result = cleanUpByPatterns([], [], path);

    expect(result).toEqual([]);
  });

  test('it should return the complete file list when the pattern array is empty', () => {
    const result = cleanUpByPatterns(files, [], path);

    expect(result).toEqual([
      '/lib/__mock__/file1.ts',
      '/lib/helper/file2.ts',
      '/lib/tools/file3.ts',
      '/lib/src/file4.ts',
    ]);
  });

  test('it should return the file list cleaned from the pattern when pattern is defined', () => {
    const result = cleanUpByPatterns(files, patterns, path);

    expect(result).toEqual(['/lib/helper/file2.ts', '/lib/src/file4.ts']);
  });

  test('it should return an empty file list when pattern is defined but the file array is empty', () => {
    const result = cleanUpByPatterns([], patterns, path);

    expect(result).toEqual([]);
  });
});

describe('check the function cleanUpByFiles()', () => {
  let testFiles: string[];
  let files: string[];

  beforeEach(() => {
    testFiles = ['/src/lib/file1.test.ts', '/src/lib/file3.test.ts'];
    files = ['/src/lib/file1.test.ts', '/src/lib/file1.ts', '/src/lib/file2.ts'];
  });

  test('it should return an empty file list when the files and the testFiles array is empty', () => {
    const result = cleanUpByFiles([], []);

    expect(result).toEqual([]);
  });

  test('it should return the file list without test files when files and test files are defined', () => {
    const result = cleanUpByFiles(files, testFiles);

    expect(result).toEqual(['/src/lib/file1.ts', '/src/lib/file2.ts']);
  });
});
