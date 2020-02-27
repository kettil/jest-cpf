import { JestConfigType } from '../types';

export const cleanUpByPatterns = (files: string[], patterns: string[], rootPath: string) =>
  patterns
    .map((pattern) => new RegExp(pattern.replace('<rootDir>', rootPath)))
    .reduce((reduceFiles, pattern) => reduceFiles.filter((file) => !pattern.test(file)), files);

export const cleanUpByFiles = (files: string[], testFiles: string[]) => {
  testFiles.forEach((file) => {
    const pos = files.indexOf(file);

    if (pos >= 0) {
      delete files[pos];
    }
  });

  return files.filter((f) => Boolean(f));
};

const cleanUpFiles = (files: string[], testFiles: string[], config: JestConfigType) => {
  // remove all files from ignore patterns
  const filesWithoutPatterns = cleanUpByPatterns(files, config.coveragePathIgnorePatterns, config.rootDir);

  // remove all test files
  return cleanUpByFiles(filesWithoutPatterns, testFiles);
};

export default cleanUpFiles;
