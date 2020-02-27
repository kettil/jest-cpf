import { createFolder } from '../files/fileSystems';
import { JestConfigType } from '../types';
import createRunner from './createRunner';
import createRunners from './createRunners';

jest.mock('../files/fileSystems');
jest.mock('./createRunner');

const createFolderMock = createFolder as jest.Mock;
const createRunnerMock = createRunner as jest.Mock;

describe('createRunners()', () => {
  test('it should created a runner list', async () => {
    expect.assertions(6);

    createFolderMock.mockResolvedValue('/path/to/coverage');
    createRunnerMock.mockResolvedValueOnce({
      configFile: '/path/to/child-1/config.json',
      coverageFile: '/path/to/child-1/coverage-summary.json',
    });
    createRunnerMock.mockResolvedValueOnce({
      configFile: '/path/to/child-2/config.json',
      coverageFile: '/path/to/child-2/coverage-summary.json',
    });

    const config: JestConfigType = {
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
      coverageDirectory: '/path/to/coverage',
      coveragePathIgnorePatterns: [],
      coverageReporters: [],
      coverageThreshold: { global: { statements: 100, lines: 100, functions: 100, branches: 100 } },
      rootDir: '/path/to/project',
      roots: ['src', 'pages'],
      testMatch: [],
    };

    const promise = createRunners({ ...config }, 2);

    await expect(promise).resolves.toEqual([
      {
        configFile: '/path/to/child-1/config.json',
        coverageFile: '/path/to/child-1/coverage-summary.json',
      },
      {
        configFile: '/path/to/child-2/config.json',
        coverageFile: '/path/to/child-2/coverage-summary.json',
      },
    ]);

    expect(createFolderMock).toHaveBeenCalledTimes(1);
    expect(createFolderMock).toHaveBeenCalledWith(config.rootDir, config.coverageDirectory);
    expect(createRunnerMock).toHaveBeenCalledTimes(2);
    expect(createRunnerMock).toHaveBeenNthCalledWith(1, 1, '/path/to/coverage', config);
    expect(createRunnerMock).toHaveBeenNthCalledWith(2, 2, '/path/to/coverage', config);
  });
});
