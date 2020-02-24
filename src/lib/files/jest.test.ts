import { hasFileAccess } from './fileSystems';
import { getJestConfig, getJestFilename } from './jest';

jest.mock('./fileSystems');
jest.mock('/data/config.json', () => ({ q: 42, config: 'file' }), { virtual: true });

const hasFileAccessMock = hasFileAccess as jest.Mock;

describe('check the function cleanUpByPatterns()', () => {
  test('it should return a config object when the file exists', async () => {
    hasFileAccessMock.mockResolvedValue(true);

    const promise = getJestConfig('/data', 'config.json');

    await expect(promise).resolves.toEqual({ config: 'file', q: 42 });

    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith(expect.any(String), 4);
  });

  test('it should return a config object when the file non-exists', async () => {
    hasFileAccessMock.mockResolvedValue(false);

    const promise = getJestConfig('/data', 'not-exist.json');

    await expect(promise).rejects.toThrow();

    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith(expect.any(String), 4);
  });
});

describe('check the function getJestFilename()', () => {
  test('it should return the path of jest on the same level when a path is passed', async () => {
    hasFileAccessMock.mockResolvedValue(true);

    const promise = getJestFilename('/path/to/jest');

    await expect(promise).resolves.toEqual('/path/to/jest/node_modules/.bin/jest');

    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith('/path/to/jest/node_modules/.bin/jest', 1);
  });

  test('it should return the path of jest on another level when a path is passed', async () => {
    hasFileAccessMock.mockResolvedValueOnce(false);
    hasFileAccessMock.mockResolvedValueOnce(false);
    hasFileAccessMock.mockResolvedValue(true);

    const promise = getJestFilename('/path/to/jest');

    await expect(promise).resolves.toEqual('/path/node_modules/.bin/jest');

    expect(hasFileAccess).toHaveBeenCalledTimes(3);
    expect(hasFileAccess).toHaveBeenNthCalledWith(1, '/path/to/jest/node_modules/.bin/jest', 1);
    expect(hasFileAccess).toHaveBeenNthCalledWith(2, '/path/to/node_modules/.bin/jest', 1);
    expect(hasFileAccess).toHaveBeenNthCalledWith(3, '/path/node_modules/.bin/jest', 1);
  });

  test('it should return "jest" when a path is passed', async () => {
    hasFileAccessMock.mockResolvedValue(false);

    const promise = getJestFilename('/path/to/jest');

    await expect(promise).resolves.toEqual('jest');

    expect(hasFileAccess).toHaveBeenCalledTimes(4);
    expect(hasFileAccess).toHaveBeenNthCalledWith(1, '/path/to/jest/node_modules/.bin/jest', 1);
    expect(hasFileAccess).toHaveBeenNthCalledWith(2, '/path/to/node_modules/.bin/jest', 1);
    expect(hasFileAccess).toHaveBeenNthCalledWith(3, '/path/node_modules/.bin/jest', 1);
    expect(hasFileAccess).toHaveBeenNthCalledWith(4, '/node_modules/.bin/jest', 1);
  });
});
