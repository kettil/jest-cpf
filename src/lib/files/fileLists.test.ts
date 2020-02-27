import getFileList from './fileList';
import getFileLists from './fileLists';

jest.mock('./fileList');

const getFileListMock = getFileList as jest.Mock;

describe('getFileLists()', () => {
  test('it should work with found files', async () => {
    expect.assertions(2);

    getFileListMock.mockResolvedValueOnce(['src/index.test.ts', 'src/lib/app.test.ts']);
    getFileListMock.mockResolvedValueOnce(['src/index.test.js', 'src/lib/app.test.ts']);
    getFileListMock.mockResolvedValueOnce(['page/index.test.ts']);
    getFileListMock.mockResolvedValueOnce(['page/index.test.js']);

    const callbackMock = jest.fn(() => '/path/to/project');
    const pattern = ['**/*.test.{ts,tsx}', '**/*.test.{js,jsx}'];
    const paths = ['src', 'pages'];

    const promise = getFileLists(paths, pattern, callbackMock);

    await expect(promise).resolves.toEqual([
      'src/index.test.ts',
      'src/lib/app.test.ts',
      'src/index.test.js',
      'page/index.test.ts',
      'page/index.test.js',
    ]);

    expect(getFileListMock).toHaveBeenCalledTimes(4);
  });

  test('it should work with not found files', async () => {
    expect.assertions(2);

    getFileListMock.mockResolvedValue([]);

    const callbackMock = jest.fn(() => '');
    const pattern = ['**/*.test.{ts,tsx}'];
    const paths = ['src', 'pages'];

    const promise = getFileLists(paths, pattern, callbackMock);

    await expect(promise).resolves.toEqual([]);

    expect(getFileListMock).toHaveBeenCalledTimes(2);
  });

  test('it should throw an error', async () => {
    expect.assertions(2);

    getFileListMock.mockRejectedValueOnce(new Error('glob-error'));
    getFileListMock.mockRejectedValue([]);

    const callbackMock = jest.fn(() => '');
    const pattern = ['**/*.test.{ts,tsx}'];
    const paths = ['src', 'pages'];

    const promise = getFileLists(paths, pattern, callbackMock);

    await expect(promise).rejects.toThrow('glob-error');

    expect(getFileListMock).toHaveBeenCalledTimes(2);
  });
});
