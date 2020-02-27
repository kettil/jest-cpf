/* eslint-disable no-console, @typescript-eslint/unbound-method */
import { SingleBar } from 'cli-progress';
import { TestError } from './helpers/errors';
import styling, { statusToType } from './helpers/styling';
import { outputError, outputMetrics, outputProgress, outputStatus, outputTable } from './outputs';
import { ThresholdGroupType } from './types';

jest.mock('cli-progress');
jest.mock('./helpers/styling');
jest.spyOn(console, 'log');
jest.spyOn(console, 'error');

beforeEach(() => {
  (styling as jest.Mock).mockImplementation((m: string, t: string) => `[${t}]${m}[/${t}]`);
  (statusToType as jest.Mock).mockImplementation((s: string) => (s === 'success' ? 'green' : 'red'));
});

describe('outputError()', () => {
  test('it should work with test error object', () => {
    const error = new TestError('test-error-object', 'data-string');

    outputError(error);

    expect(console.error).toHaveBeenCalledTimes(5);
    expect(console.error).toMatchSnapshot('error');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('');
  });

  test('it should work with error object', () => {
    const error = new Error('error-object-with-stack');

    outputError(error);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(expect.any(String));
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('');
  });

  test('it should work with error object and without stack', () => {
    const error = new Error('error-object-without-stack');

    delete error.stack;

    outputError(error);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toMatchSnapshot('error');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('');
  });

  test('it should work with error string', () => {
    outputError('error-string');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('error-string');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('');
  });
});

describe('outputMetrics()', () => {
  test('it should work with test error object', () => {
    const status = { error: 6, success: 34 };

    outputMetrics(status, '00:00');

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(6);
    expect(console.log).toMatchSnapshot('log');
  });
});

describe('outputProgress()', () => {
  test('it should work', () => {
    const bar = outputProgress(10);

    expect(bar).toEqual({ increment: expect.any(Function), stop: expect.any(Function) });

    expect(SingleBar.prototype.start).toHaveBeenCalledTimes(1);
  });

  test('it should work and increment the bar', () => {
    const bar = outputProgress(10);

    expect(bar.increment).toEqual(expect.any(Function));

    bar.increment();

    expect(SingleBar.prototype.increment).toHaveBeenCalledTimes(1);
  });

  test('it should work and stop the bar', () => {
    const bar = outputProgress(10);

    expect(bar.stop).toEqual(expect.any(Function));

    bar.stop();

    expect(SingleBar.prototype.stop).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});

describe('outputStatus()', () => {
  test('it should work', () => {
    outputStatus(5, 3, 4, 2);

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toMatchSnapshot('log');
  });
});

describe('outputTable()', () => {
  test('it should work', () => {
    const thresholdLimits = { branches: 90, functions: 90, statements: 90, lines: 90 };
    const thresholds: ThresholdGroupType[] = [
      {
        file: '/path/to/file-1.ts',
        threshold: {
          branches: { percent: 90, uncovered: 3 },
          functions: { percent: 90, uncovered: 3 },
          lines: { percent: 80, uncovered: 3 },
          statements: { percent: 90, uncovered: 3 },
        },
      },
      {
        file: '/path/to/file-1.ts',
        threshold: { branches: 'ERROR', functions: 'ERROR', lines: 'ERROR', statements: 'ERROR' },
      },
    ];

    outputTable(thresholds, thresholdLimits);

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toMatchSnapshot('log');
  });
});
