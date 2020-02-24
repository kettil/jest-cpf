import glob from 'glob';
import getFileList from './fileList';

jest.mock('glob');

const globMock = (glob as unknown) as jest.Mock;

describe('check the function getFileList()', () => {
  test('it should return the file list when files are found', async () => {
    expect.assertions(4);

    globMock.mockImplementation(
      async (pattern: unknown, options: unknown, callback: (error?: unknown, matches?: unknown[]) => void) => {
        expect(pattern).toEqual('**/*.test.{ts,tsx}');
        expect(options).toEqual({ cwd: '/path/to/project' });
        expect(typeof callback).toBe('function');

        callback(undefined, ['index.test.ts', 'lib/app.test.ts']);
      },
    );

    const pattern = '**/*.test.{ts,tsx}';
    const path = 'src';
    const cwd = '/path/to/project';

    const promise = getFileList(pattern, cwd, path);

    await expect(promise).resolves.toEqual(['src/index.test.ts', 'src/lib/app.test.ts']);
  });

  test('it should return an empty file list when no files are found', async () => {
    expect.assertions(4);

    globMock.mockImplementation(
      async (pattern: unknown, options: unknown, callback: (error?: unknown, matches?: unknown[]) => void) => {
        expect(pattern).toEqual('**/*.test.{ts,tsx}');
        expect(options).toEqual({ cwd: '/path/to/project' });
        expect(typeof callback).toBe('function');

        callback(undefined, []);
      },
    );

    const pattern = '**/*.test.{ts,tsx}';
    const path = 'src';
    const cwd = '/path/to/project';

    const promise = getFileList(pattern, cwd, path);

    await expect(promise).resolves.toEqual([]);
  });

  test('it should throw an error when an error occurs during creation', async () => {
    expect.assertions(4);

    globMock.mockImplementation(
      async (pattern: unknown, options: unknown, callback: (error?: unknown, matches?: unknown[]) => void) => {
        expect(pattern).toEqual('**/*.test.{ts,tsx}');
        expect(options).toEqual({ cwd: '/path/to/project' });
        expect(typeof callback).toBe('function');

        callback(new Error('glob-error'));
      },
    );

    const pattern = '**/*.test.{ts,tsx}';
    const path = 'src';
    const cwd = '/path/to/project';

    const promise = getFileList(pattern, cwd, path);

    await expect(promise).rejects.toThrow('glob-error');
  });
});
