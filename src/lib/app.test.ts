/* eslint-disable @typescript-eslint/unbound-method */
import { cpus } from 'os';
import app from './app';
import appEvaluation from './appEvaluation';
import appExecute from './appExecute';
import { startTime } from './helpers/time';

jest.mock('os');
jest.mock('./helpers/time');
jest.mock('./appExecute');
jest.mock('./appEvaluation');
jest.spyOn(process, 'exit');
jest.spyOn(process, 'cwd');

const cwdMock = process.cwd as jest.Mock;
const cpusMock = cpus as jest.Mock;
const startTimeMock = startTime as jest.Mock;
const appExecuteMock = appExecute as jest.Mock;
const appEvaluationMock = appEvaluation as jest.Mock;

describe('app()', () => {
  beforeEach(() => {
    cwdMock.mockReturnValueOnce('/path/to/project');
    cpusMock.mockReturnValueOnce([1, 2, 3, 4]);
    startTimeMock.mockReturnValueOnce({ time: 'object' });
    appExecuteMock.mockResolvedValueOnce({ data: 'fromExecute' });
  });

  test('it should work with faulty tests', async () => {
    appEvaluationMock.mockReturnValueOnce({ error: 3, success: 97 });

    const argvArray = ['--config', '/path/to/config.json'];
    const argvObject = { config: '/path/to/config.json' };

    const promise = app(argvArray, argvObject);

    await expect(promise).resolves.toBeUndefined();

    expect(cpusMock).toHaveBeenCalledTimes(1);

    expect(appExecuteMock).toHaveBeenCalledTimes(1);
    expect(appExecuteMock).toMatchSnapshot('appExecute');

    expect(appEvaluationMock).toHaveBeenCalledTimes(1);
    expect(appEvaluationMock).toMatchSnapshot('appEvaluation');

    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('it should work without faulty tests', async () => {
    appEvaluationMock.mockReturnValueOnce({ error: 0, success: 100 });

    const argvArray = ['--config', '/path/to/config.json'];
    const argvObject = { config: '/path/to/config.json' };

    const promise = app(argvArray, argvObject);

    await expect(promise).resolves.toBeUndefined();

    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
