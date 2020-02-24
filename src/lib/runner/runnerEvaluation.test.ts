import { TestError } from '../helper';
import extract from '../threshold/extract';
import { RunnerType, RunnerEvaluationDataType, JestConfigType, ThresholdGroupType } from '../types';
import runnerEvaluation from './runnerEvaluation';

jest.mock('../threshold/extract');

const extractMock = extract as jest.Mock;
const barIncrementMock = jest.fn();
const isPendingMock = jest.fn();

describe('check the function runnerEvaluation()', () => {
  test('it should be "isPending" false and threshold list is extended when the runner test instance is defined and promise value is a string', async () => {
    expect.assertions(5);

    isPendingMock.mockReturnValue(false);
    extractMock.mockResolvedValue([
      { file: '/path/to/file.ts', threshold: { branches: 90, functions: 67, lines: 64, statements: 85 } },
    ]);

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/summary.json',
      test: {
        file: '/path/to/file.test.ts',
        isPending: isPendingMock,
        promise: Promise.resolve('mock: promise'),
      },
    };

    const thresholds = [] as ThresholdGroupType[];
    const config = {} as JestConfigType;
    const data: RunnerEvaluationDataType = { barIncrement: barIncrementMock, thresholds, config };

    const promise = runnerEvaluation(runner, data);

    await expect(promise).resolves.toBe(false);

    expect(thresholds).toHaveLength(1);
    expect(thresholds).toEqual([
      { file: '/path/to/file.ts', threshold: { branches: 90, functions: 67, lines: 64, statements: 85 } },
    ]);
    expect(isPendingMock).toHaveBeenCalledTimes(1);
    expect(barIncrementMock).toHaveBeenCalledTimes(1);
  });

  test('it should be "isPending" false and threshold list is extended when the runner test instance is defined and promise value is an error', async () => {
    expect.assertions(5);

    isPendingMock.mockReturnValue(false);
    extractMock.mockResolvedValue([
      { file: '/path/to/file.ts', threshold: { branches: 90, functions: 67, lines: 64, statements: 85 } },
    ]);

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/summary.json',
      test: {
        file: '/path/to/file.test.ts',
        isPending: isPendingMock,
        promise: Promise.resolve(new TestError('promise-error', 'data-string')),
      },
    };

    const thresholds = [] as ThresholdGroupType[];
    const config = {} as JestConfigType;
    const data: RunnerEvaluationDataType = { barIncrement: barIncrementMock, thresholds, config };

    const promise = runnerEvaluation(runner, data);

    await expect(promise).resolves.toBe(false);

    expect(thresholds).toHaveLength(1);
    expect(thresholds).toEqual([
      {
        error: expect.any(TestError),
        file: '/path/to/file.test.ts',
        threshold: { branches: 'ERROR', functions: 'ERROR', lines: 'ERROR', statements: 'ERROR' },
      },
    ]);
    expect(isPendingMock).toHaveBeenCalledTimes(1);
    expect(barIncrementMock).toHaveBeenCalledTimes(1);
  });

  test('it should be "isPending" true and threshold list is not extended when the runner test instance is defined and pending is true', async () => {
    expect.assertions(4);

    isPendingMock.mockReturnValue(true);

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/summary.json',
      test: {
        file: '/path/to/file.test.ts',
        isPending: isPendingMock,
        promise: Promise.resolve('mock: promise'),
      },
    };

    const thresholds = [] as ThresholdGroupType[];
    const config = {} as JestConfigType;
    const data: RunnerEvaluationDataType = { barIncrement: barIncrementMock, thresholds, config };

    const promise = runnerEvaluation(runner, data);

    await expect(promise).resolves.toBe(true);

    expect(thresholds).toHaveLength(0);
    expect(isPendingMock).toHaveBeenCalledTimes(1);
    expect(barIncrementMock).toHaveBeenCalledTimes(0);
  });

  test('it should be "isPending" false and threshold list is not extended when the runner test instance is not defined', async () => {
    expect.assertions(4);

    const runner: RunnerType = {
      configFile: '/path/to/config',
      coverageFile: '/path/to/summary.json',
    };

    const thresholds = [] as ThresholdGroupType[];
    const config = {} as JestConfigType;
    const data: RunnerEvaluationDataType = { barIncrement: barIncrementMock, thresholds, config };

    const promise = runnerEvaluation(runner, data);

    await expect(promise).resolves.toBe(false);

    expect(thresholds).toHaveLength(0);
    expect(isPendingMock).toHaveBeenCalledTimes(0);
    expect(barIncrementMock).toHaveBeenCalledTimes(0);
  });
});
