import appExecute, { getFileListsCallback } from './appExecute';
import getFileLists from './files/fileLists';
import { getJestConfig } from './files/jest';
import { outputStatus } from './outputs';
import createRunners from './runner/createRunners';
import runTests from './runner/runTests';

jest.mock('./files/jest');
jest.mock('./files/fileLists');
jest.mock('./runner/createRunners');
jest.mock('./outputs');
jest.mock('./runner/runTests');

const getJestConfigMock = getJestConfig as jest.Mock;
const createRunnersMock = createRunners as jest.Mock;
const getFileListsMock = getFileLists as jest.Mock;
const outputStatusMock = outputStatus as jest.Mock;
const runTestsMock = runTests as jest.Mock;

describe('getFileListsCallback()', () => {
  test('it should work with rootDir', () => {
    const callback = getFileListsCallback('/path/to/project');

    expect(typeof callback).toBe('function');

    const result = callback('/path/to/project/src/index.ts');

    expect(result).toBe('src/index.ts');
  });

  test('it should work without rootDir', () => {
    const callback = getFileListsCallback();

    expect(typeof callback).toBe('function');

    const result = callback('/path/to/project/src/index.ts');

    expect(result).toBe('');
  });
});

describe('appExecute()', () => {
  test('it should work', async () => {
    getJestConfigMock.mockResolvedValueOnce({
      testMatch: ['**/*.test.{js,jsx,ts,tsx}'],
      collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
    });

    getFileListsMock.mockResolvedValueOnce(['/path/to/project/src/index.ts', '/path/to/project/src/app.ts']);
    getFileListsMock.mockResolvedValueOnce(['/path/to/project/src/index.test.ts']);
    createRunnersMock.mockResolvedValueOnce([{ isRunner: true }]);
    runTestsMock.mockResolvedValueOnce([
      {
        file: '/path/to/project/src/index.ts',
        threshold: {
          branches: { percent: 90, uncovered: 3 },
          statements: { percent: 90, uncovered: 3 },
          lines: { percent: 90, uncovered: 3 },
          functions: { percent: 90, uncovered: 3 },
        },
      },
    ]);

    const argvArray = ['--config', '/path/to/project/config.json'];
    const argvObject = { config: '/path/to/project/config.json' };

    const promise = appExecute(argvArray, argvObject, '/path/to/project', 5, 3);

    await expect(promise).resolves.toEqual({
      thresholdLimits: { branches: 95, functions: 95, lines: 95, statements: 95 },
      cleanedUpFiles: ['/path/to/project/src/index.ts', '/path/to/project/src/app.ts'],
      thresholdData: [
        {
          file: '/path/to/project/src/index.ts',
          threshold: {
            branches: { percent: 90, uncovered: 3 },
            functions: { percent: 90, uncovered: 3 },
            lines: { percent: 90, uncovered: 3 },
            statements: { percent: 90, uncovered: 3 },
          },
        },
      ],
    });

    expect(getJestConfigMock).toHaveBeenCalledTimes(1);
    expect(getFileListsMock).toHaveBeenCalledTimes(2);
    expect(createRunnersMock).toHaveBeenCalledTimes(1);
    expect(runTestsMock).toHaveBeenCalledTimes(1);

    expect(outputStatusMock).toHaveBeenCalledTimes(1);
    expect(outputStatusMock).toMatchSnapshot('outputStatus');
  });

  test('it should throw an error', async () => {
    const promise = appExecute([], {}, '/path/to/project', 5, 3);

    await expect(promise).rejects.toThrow('The Argument "--config" is missing');
  });
});
