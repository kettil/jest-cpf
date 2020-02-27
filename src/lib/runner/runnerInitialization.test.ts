import { RunnerType, RunnerInitializationDataType, JestConfigType } from '../types';
import runnerInitialization from './runnerInitialization';
import runnerSpawn from './runnerSpawn';

jest.mock('./runnerSpawn');

const runnerSpawnMock = runnerSpawn as jest.Mock;

describe('runnerInitialization()', () => {
  test('it should created test instance', () => {
    expect.assertions(6);

    runnerSpawnMock.mockResolvedValue('runner-spawn');

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/coverage',
    };

    const testFiles = ['/path/to/project/src/index.test.ts', '/path/to/project/src/lib/app.test.ts'];
    const data: RunnerInitializationDataType = {
      argvArray: ['--config', '/path/to/other/config'],
      command: 'jest',
      config: { rootDir: '/path/to/project' } as JestConfigType,
      configFile: '/path/to/other/config',
      testFiles,
    };

    const result = runnerInitialization(runner, data);

    expect(result).toBe(true);

    expect(testFiles).toHaveLength(1);
    expect(testFiles).toEqual(['/path/to/project/src/lib/app.test.ts']);

    expect(runner).toEqual({
      configFile: '/path/to/config',
      coverageFile: '/path/to/coverage',
      test: {
        file: '/path/to/project/src/index.test.ts',
        isPending: expect.any(Function),
        promise: expect.any(Promise),
      },
    });

    expect(runnerSpawnMock).toHaveBeenCalledTimes(1);
    expect(runnerSpawnMock).toHaveBeenCalledWith(
      'jest',
      [
        '--config',
        '/path/to/config',
        '--collectCoverageFrom=/path/to/project/src/index.*',
        '/path/to/project/src/index.test.ts',
      ],
      { rootDir: '/path/to/project' },
    );
  });

  test('it should created not test instance because no test file', () => {
    expect.assertions(3);

    runnerSpawnMock.mockResolvedValue('runner-spawn');

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/coverage',
    };

    const data: RunnerInitializationDataType = {
      argvArray: ['--config', '/path/to/other/config'],
      command: 'jest',
      config: { rootDir: '/path/to/project' } as JestConfigType,
      configFile: '/path/to/other/config',
      testFiles: [],
    };

    const result = runnerInitialization(runner, data);

    expect(result).toBe(false);

    expect(runner).toEqual({
      configFile: '/path/to/config',
      coverageFile: '/path/to/coverage',
    });

    expect(runnerSpawnMock).toHaveBeenCalledTimes(0);
  });

  test('it should created not test instance because instance exists', () => {
    expect.assertions(3);

    runnerSpawnMock.mockResolvedValue('runner-spawn');

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/coverage',
      test: {
        file: 'filename',
        isPending: jest.fn(),
        promise: Promise.resolve('runner-spawn'),
      },
    };

    const data: RunnerInitializationDataType = {
      argvArray: ['--config', '/path/to/other/config'],
      command: 'jest',
      config: { rootDir: '/path/to/project' } as JestConfigType,
      configFile: '/path/to/other/config',
      testFiles: [],
    };

    const result = runnerInitialization(runner, data);

    expect(result).toBe(false);

    expect(runner).toEqual({
      configFile: '/path/to/config',
      coverageFile: '/path/to/coverage',
      test: {
        file: 'filename',
        isPending: expect.any(Function),
        promise: expect.any(Promise),
      },
    });

    expect(runnerSpawnMock).toHaveBeenCalledTimes(0);
  });
});
