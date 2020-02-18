import { access, mkdir } from 'fs';
import { join } from 'path';

export const hasFileAccess = (file: string, mode: number) =>
  new Promise<boolean>((resolve) => access(file, mode, (error) => resolve(!error)));

export const createFolder = (pathname: string, name: string | number) =>
  new Promise<string>((resolve, reject) => {
    const path = join(pathname, typeof name === 'string' ? name : `child-${name}`);

    mkdir(path, { recursive: true }, (error) => (error ? reject(error) : resolve(path)));
  });
