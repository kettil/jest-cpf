import { join } from 'path';
import glob from 'glob';

const getFileList = (pattern: string, cwd: string, path: string) =>
  new Promise<string[]>((resolve, reject) => {
    glob(pattern, { cwd }, (error, matches) =>
      error ? reject(error) : resolve(matches.map((match) => join(path, match))),
    );
  });

export default getFileList;
