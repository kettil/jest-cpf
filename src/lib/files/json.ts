import { constants, readFile, writeFile } from 'fs';
import { dirname } from 'path';
import { hasFileAccess } from './fileSystems';

export const readJsonFile = async (filename: string) => {
  const isReadable = await hasFileAccess(filename, constants.R_OK);

  if (!isReadable) {
    throw new Error(`File ${filename} is not readable`);
  }

  return new Promise<Record<string, unknown>>((resolve, reject) => {
    readFile(filename, { encoding: 'utf8' }, (error, data) => (error ? reject(error) : resolve(JSON.parse(data))));
  });
};

export const writeJsonFile = async (filename: string, data: unknown) => {
  const isWritable = await hasFileAccess(dirname(filename), constants.W_OK);

  if (!isWritable) {
    throw new Error(`File ${filename} is not writable`);
  }

  return new Promise<void>((resolve, reject) => {
    writeFile(filename, JSON.stringify(data, undefined, 2), { encoding: 'utf8' }, (error) =>
      error ? reject(error) : resolve(),
    );
  });
};
