import { access, mkdir } from 'fs';
import { hasFileAccess, createFolder } from './fileSystems';

jest.mock('fs');

const accessMock = (access as unknown) as jest.Mock;
const mkdirMock = (mkdir as unknown) as jest.Mock;

describe('check the function hasFileAccess()', () => {
  test('it should return the true value when file is exists', async () => {
    expect.assertions(4);

    accessMock.mockImplementation(async (file: unknown, mode: unknown, callback: (error?: unknown) => void) => {
      expect(file).toBe('path/to/file.json');
      expect(mode).toBe(4);
      expect(typeof callback).toBe('function');

      callback();
    });

    const promise = hasFileAccess('path/to/file.json', 4);

    await expect(promise).resolves.toBe(true);
  });

  test('it should return the false value when file is not exist', async () => {
    expect.assertions(4);

    accessMock.mockImplementation(async (file: unknown, mode: unknown, callback: (error?: unknown) => void) => {
      expect(file).toBe('path/to/unknown.json');
      expect(mode).toBe(3);
      expect(typeof callback).toBe('function');

      callback(new Error('not-found'));
    });

    const promise = hasFileAccess('path/to/unknown.json', 3);

    await expect(promise).resolves.toBe(false);
  });
});

describe('check the function createFolder()', () => {
  test('it should create a folder and return the pathname when "name" is a string', async () => {
    expect.assertions(4);

    mkdirMock.mockImplementation(async (file: unknown, options: unknown, callback: (error?: unknown) => void) => {
      expect(file).toBe('path/to/folder/folderName');
      expect(options).toEqual({ recursive: true });
      expect(typeof callback).toBe('function');

      callback();
    });

    const promise = createFolder('path/to/folder', 'folderName');

    await expect(promise).resolves.toBe('path/to/folder/folderName');
  });

  test('it should create a folder and return the extenden pathname when "name" is a number', async () => {
    expect.assertions(4);

    mkdirMock.mockImplementation(async (file: unknown, options: unknown, callback: (error?: unknown) => void) => {
      expect(file).toBe('path/to/folder/child-2');
      expect(options).toEqual({ recursive: true });
      expect(typeof callback).toBe('function');

      callback();
    });

    const promise = createFolder('path/to/folder', 2);

    await expect(promise).resolves.toBe('path/to/folder/child-2');
  });

  test('it should throw an error when an error occurs during creation', async () => {
    expect.assertions(4);

    mkdirMock.mockImplementation(async (file: unknown, options: unknown, callback: (error?: unknown) => void) => {
      expect(file).toBe('path/to/folder/name');
      expect(options).toEqual({ recursive: true });
      expect(typeof callback).toBe('function');

      callback(new Error('create-error'));
    });

    const promise = createFolder('path/to/folder', 'name');

    await expect(promise).rejects.toThrow('create-error');
  });
});
