import { spawn } from 'child_process';
import { JestConfigType } from '../types';
import runnerSpawn from './runnerSpawn';

jest.mock('child_process');

const spawnMock = spawn as jest.Mock;
const spawnOnMock = jest.fn();
const stdoutOnMock = jest.fn();
const stderrOnMock = jest.fn();

describe('runnerSpawn()', () => {
  beforeEach(() => {
    spawnMock.mockReturnValue({
      stdout: { on: stdoutOnMock },
      stderr: { on: stderrOnMock },
      on: spawnOnMock,
    });
  });

  test('it should work with success finished task', async () => {
    expect.assertions(11);

    stdoutOnMock.mockImplementation(async (event: unknown, callback: (data: string) => void) => {
      expect(event).toBe('data');
      expect(typeof callback).toBe('function');

      callback('line-1 abc\n');
    });

    stderrOnMock.mockImplementation(async (event: unknown, callback: (data: string) => void) => {
      expect(event).toBe('data');
      expect(typeof callback).toBe('function');

      callback('error-line\n');
    });

    spawnOnMock.mockImplementation(async (event: unknown, callback: (code: number) => void) => {
      expect(event).toBe('close');
      expect(typeof callback).toBe('function');

      callback(0);
    });

    const command = 'jest';
    const args = ['--config', '/path/to/config.json'];
    const config: JestConfigType = {
      collectCoverage: true,
      coverageDirectory: '/path/to/coverage',
      coveragePathIgnorePatterns: [],
      coverageReporters: [],
      coverageThreshold: { global: { statements: 100, lines: 100, functions: 100, branches: 100 } },
      rootDir: '/path/to/project',
      roots: ['src', 'pages'],
      testMatch: [],
      collectCoverageFrom: [],
    };

    const promise = runnerSpawn(command, args, { ...config });

    await expect(promise).resolves.toEqual('line-1 abc\nerror-line');

    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stdoutOnMock).toHaveBeenCalledTimes(1);
    expect(stderrOnMock).toHaveBeenCalledTimes(1);
    expect(spawnOnMock).toHaveBeenCalledTimes(1);
  });

  test('it should work with faulty finished task', async () => {
    expect.assertions(11);

    stdoutOnMock.mockImplementation(async (event: unknown, callback: (data: string) => void) => {
      expect(event).toBe('data');
      expect(typeof callback).toBe('function');

      callback('line-1 abc\n');
      callback('line-2 123\n');
    });

    stderrOnMock.mockImplementation(async (event: unknown, callback: (data: string) => void) => {
      expect(event).toBe('data');
      expect(typeof callback).toBe('function');

      callback('error-line\n');
    });

    spawnOnMock.mockImplementation(async (event: unknown, callback: (code: number) => void) => {
      expect(event).toBe('close');
      expect(typeof callback).toBe('function');

      callback(1);
    });

    const command = 'jest';
    const args = ['--config', '/path/to/config.json'];
    const config: JestConfigType = {
      collectCoverage: true,
      coverageDirectory: '/path/to/coverage',
      coveragePathIgnorePatterns: [],
      coverageReporters: [],
      coverageThreshold: { global: { statements: 100, lines: 100, functions: 100, branches: 100 } },
      rootDir: '/path/to/project',
      roots: ['src', 'pages'],
      testMatch: [],
      collectCoverageFrom: [],
    };

    const promise = runnerSpawn(command, args, { ...config });

    await expect(promise).rejects.toThrow('Jest running error');

    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stdoutOnMock).toHaveBeenCalledTimes(1);
    expect(stderrOnMock).toHaveBeenCalledTimes(1);
    expect(spawnOnMock).toHaveBeenCalledTimes(1);
  });
});
