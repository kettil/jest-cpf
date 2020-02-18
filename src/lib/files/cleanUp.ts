export const cleanUpByPatterns = (files: string[], patterns: string[], rootDirection: string) =>
  patterns
    .map((pattern) => new RegExp(pattern.replace('<rootDir>', rootDirection)))
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
