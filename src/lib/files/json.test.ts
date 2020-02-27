import { readFile, writeFile } from 'fs';
import { hasFileAccess } from './fileSystems';
import { readJsonFile, writeJsonFile } from './json';

jest.mock('fs');
jest.mock('./fileSystems');

const hasFileAccessMock = hasFileAccess as jest.Mock;
const readFileMock = (readFile as unknown) as jest.Mock;
const writeFileMock = (writeFile as unknown) as jest.Mock;

describe('readJsonFile()', () => {
  const file = './unknown/read.json';

  let readFn: (f: unknown, o: unknown, callback: (e?: unknown, d?: unknown) => void) => Promise<void>;
  let readCallbackError: unknown;
  let readCallbackData: unknown;

  beforeEach(() => {
    readCallbackError = undefined;
    readCallbackData = undefined;

    readFn = async (filename, options, callback) => {
      expect(filename).toBe(file);
      expect(options).toEqual({ encoding: 'utf8' });
      expect(typeof callback).toBe('function');

      callback(readCallbackError, readCallbackData);
    };
  });

  test('it should work', async () => {
    expect.assertions(7);

    readCallbackData = '{"a":42,"b":"z"}';

    hasFileAccessMock.mockResolvedValue(true);
    readFileMock.mockImplementation(readFn);

    const promise = await readJsonFile(file);

    expect(promise).toEqual({ a: 42, b: 'z' });

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith(file, 4);
  });

  test('it should throw an error by the json parsing', async () => {
    expect.assertions(7);

    readCallbackData = '{"a":42,"b":"z}';

    hasFileAccessMock.mockResolvedValue(true);
    readFileMock.mockImplementation(readFn);

    const promise = readJsonFile(file);

    await expect(promise).rejects.toThrow('Unexpected end of JSON input');

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith(file, 4);
  });

  test('it should throw an error by a non-readable file', async () => {
    expect.assertions(4);

    hasFileAccessMock.mockResolvedValue(false);

    const promise = readJsonFile(file);

    await expect(promise).rejects.toThrow('File ./unknown/read.json is not readable');

    expect(readFileMock).toHaveBeenCalledTimes(0);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith(file, 4);
  });

  test('it should throw an error by readfile()', async () => {
    expect.assertions(7);

    readCallbackError = new Error('Read error');

    hasFileAccessMock.mockResolvedValue(true);
    readFileMock.mockImplementation(readFn);

    const promise = readJsonFile(file);

    await expect(promise).rejects.toThrow('Read error');

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith(file, 4);
  });
});

describe('writeJsonFile()', () => {
  const file = './unknown/write.json';

  let writeFn: (f: unknown, d: unknown, o: unknown, callback: (e?: unknown) => void) => Promise<void>;
  let writeCallbackError: unknown;
  let writeCallbackData: unknown;

  beforeEach(() => {
    writeCallbackError = undefined;
    writeCallbackData = undefined;

    writeFn = async (filename, data, options, callback) => {
      expect(filename).toBe(file);
      expect(data).toBe(writeCallbackData);
      expect(options).toEqual({ encoding: 'utf8' });
      expect(typeof callback).toBe('function');

      callback(writeCallbackError);
    };
  });

  test('it should work', async () => {
    expect.assertions(8);

    writeCallbackData = '{\n  "z": 42,\n  "y": "a"\n}';

    hasFileAccessMock.mockResolvedValue(true);
    writeFileMock.mockImplementation(writeFn);

    const promise = await writeJsonFile(file, { z: 42, y: 'a' });

    expect(promise).toBeUndefined();

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith('./unknown', 2);
  });

  test('it should throw an error by non-writable file', async () => {
    expect.assertions(4);

    hasFileAccessMock.mockResolvedValue(false);

    const promise = writeJsonFile(file, { a: 42, b: 'z' });

    await expect(promise).rejects.toThrow('File ./unknown/write.json is not writable');

    expect(writeFileMock).toHaveBeenCalledTimes(0);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith('./unknown', 2);
  });

  test('it should throw an error by writeFile()', async () => {
    expect.assertions(8);

    writeCallbackError = new Error('Write error');
    writeCallbackData = '{\n  "a": 42,\n  "b": "z"\n}';

    hasFileAccessMock.mockResolvedValue(true);
    writeFileMock.mockImplementation(writeFn);

    const promise = writeJsonFile(file, { a: 42, b: 'z' });

    await expect(promise).rejects.toThrow('Write error');

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledTimes(1);
    expect(hasFileAccess).toHaveBeenCalledWith('./unknown', 2);
  });
});
