import { getJestFilename } from '../files/jest';
import { outputProgress } from '../outputs';
import { RunnerType, JestConfigType, RunnerInitializationDataType, RunnerEvaluationDataType } from '../types';
import runnerEvaluation from './runnerEvaluation';
import runnerInitialization from './runnerInitialization';
import runTests from './runTests';

jest.mock('../files/jest');
jest.mock('../outputs');
jest.mock('./runnerEvaluation');
jest.mock('./runnerInitialization');

const getJestFilenameMock = getJestFilename as jest.Mock;
const outputProgressMock = outputProgress as jest.Mock;
const runnerEvaluationMock = runnerEvaluation as jest.Mock;
const runnerInitializationMock = runnerInitialization as jest.Mock;

const barIncrementMock = jest.fn();
const barStopMock = jest.fn();

describe('check the function runTests()', () => {
  beforeEach(() => {
    getJestFilenameMock.mockReturnValue('path/to/jest');

    outputProgressMock.mockReturnValue({
      increment: barIncrementMock,
      stop: barStopMock,
    });
  });

  test('it should thresholds list was created when one or more test files exists', async () => {
    expect.assertions(6);

    runnerEvaluationMock.mockResolvedValueOnce(false);
    runnerEvaluationMock.mockResolvedValueOnce(true);
    runnerEvaluationMock.mockResolvedValueOnce(true);
    runnerEvaluationMock.mockImplementationOnce(async (_: unknown, data: RunnerEvaluationDataType) => {
      data.thresholds.push({
        file: '/path/to/file',
        threshold: {
          branches: { percent: 1, uncovered: 1 },
          functions: { percent: 1, uncovered: 1 },
          lines: { percent: 1, uncovered: 1 },
          statements: { percent: 1, uncovered: 1 },
        },
      });

      return false;
    });

    runnerInitializationMock.mockImplementationOnce((_: unknown, data: RunnerInitializationDataType) => {
      data.testFiles.shift();

      return true;
    });
    runnerInitializationMock.mockReturnValue(false);

    const testFiles = ['/path/to/project/src/index.test.ts'];
    const runners: RunnerType[] = [{ configFile: '/path/to/config', coverageFile: '/path/to/coverage' }];
    const argvArray = ['--config', '/path/to/project/config'];
    const config = { rootDir: '/path/to/project' } as JestConfigType;
    const configFile = '/path/to/project/config';

    const promise = runTests(testFiles, runners, argvArray, configFile, config);

    const expectedThreshold = {
      branches: { percent: 1, uncovered: 1 },
      functions: { percent: 1, uncovered: 1 },
      lines: { percent: 1, uncovered: 1 },
      statements: { percent: 1, uncovered: 1 },
    };

    await expect(promise).resolves.toEqual([
      {
        file: '/path/to/file',
        threshold: expectedThreshold,
      },
    ]);

    expect(runnerEvaluationMock).toHaveBeenCalledTimes(4);
    expect(runnerEvaluationMock).toHaveBeenCalledWith(
      { configFile: '/path/to/config', coverageFile: '/path/to/coverage' },
      {
        testFiles,
        argvArray,
        configFile,
        config,
        barIncrement: barIncrementMock,
        command: 'path/to/jest',
        thresholds: [{ file: '/path/to/file', threshold: expectedThreshold }],
      },
    );

    expect(runnerInitializationMock).toHaveBeenCalledTimes(4);
    expect(runnerInitializationMock).toHaveBeenCalledWith(
      { configFile: '/path/to/config', coverageFile: '/path/to/coverage' },
      {
        testFiles,
        argvArray,
        configFile,
        config,
        barIncrement: barIncrementMock,
        command: 'path/to/jest',
        thresholds: [{ file: '/path/to/file', threshold: expectedThreshold }],
      },
    );

    expect(barStopMock).toHaveBeenCalledTimes(1);
  });
});
