import { createFolder } from '../files/fileSystems';
import { writeJsonFile } from '../files/json';
import { JestConfigType } from '../types';
import createRunner from './createRunner';

jest.mock('../files/fileSystems');
jest.mock('../files/json');

const createFolderMock = createFolder as jest.Mock;
const writeJsonFileMock = writeJsonFile as jest.Mock;

describe('check the function createRunner()', () => {
  test('it should return a runner object when the subfolder is created', async () => {
    expect.assertions(4);

    createFolderMock.mockResolvedValue('/path/to/folder/child-1');

    const i = 1;
    const folder = '/path/to/folder';
    const config: JestConfigType = {
      collectCoverage: true,
      coverageDirectory: '/path/to/coverage',
      coveragePathIgnorePatterns: [],
      coverageReporters: [],
      coverageThreshold: { global: { statements: 100, lines: 100, functions: 100, branches: 100 } },
      rootDir: '/path/to/project',
      roots: ['src', 'pages'],
      testMatch: [],
    };

    const promise = createRunner(i, folder, { ...config });

    await expect(promise).resolves.toEqual({
      configFile: '/path/to/folder/child-1/config.json',
      coverageFile: '/path/to/folder/child-1/coverage-summary.json',
    });

    expect(createFolderMock).toHaveBeenCalledTimes(1);
    expect(writeJsonFileMock).toHaveBeenCalledTimes(1);
    expect(writeJsonFileMock).toHaveBeenCalledWith('/path/to/folder/child-1/config.json', {
      ...config,
      coverageDirectory: '/path/to/folder/child-1',
    });
  });
});
