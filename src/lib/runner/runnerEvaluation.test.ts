import { TestError } from '../helpers/errors';
import extract from '../threshold/extract';
import { RunnerType, RunnerEvaluationDataType, JestConfigType, ThresholdGroupType } from '../types';
import runnerEvaluation from './runnerEvaluation';

jest.mock('../threshold/extract');

const extractMock = extract as jest.Mock;
const barIncrementMock = jest.fn();
const isPendingMock = jest.fn();

describe('runnerEvaluation()', () => {
  test('it should work with success finished task', async () => {
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

  test('it should work with faulty finished task', async () => {
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

  test('it should work with pending task', async () => {
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

  test('it should work without task', async () => {
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
