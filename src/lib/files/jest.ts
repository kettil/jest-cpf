import { constants } from 'fs';
import { join, dirname } from 'path';
import { hasFileAccess } from './fileSystems';

export const getJestConfig = async (cwdDirectory: string, filename: string): Promise<Record<string, unknown>> => {
  const file = join(cwdDirectory, filename);

  const isReadable = await hasFileAccess(file, constants.R_OK);

  if (!isReadable) {
    throw new Error(`File ${file} is not readable`);
  }

  return require(file);
};

export const getJestFilename = async (path: string) => {
  let isRoot = false;
  let pathname = path;

  do {
    const filename = join(pathname, 'node_modules/.bin/jest');
    const isExecutable = await hasFileAccess(filename, constants.X_OK);

    if (isExecutable) {
      return filename;
    }

    isRoot = pathname === dirname(pathname);
    pathname = dirname(pathname);
  } while (!isRoot && pathname !== '');

  return 'jest';
};
