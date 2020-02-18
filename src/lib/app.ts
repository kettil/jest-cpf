import { cpus } from 'os';
import { DateTime } from 'luxon';
import { cleanUpByPatterns, cleanUpByFiles } from './files/cleanUp';
import getFileLists from './files/fileLists';
import { getJestConfig } from './files/jest';
import { cleanFileFromRootPath } from './helper';
import normalizeConfig from './normalize';
import { outputStatus, outputTable, outputMetrics } from './outputs';
import createRunners from './runner/createRunners';
import runTests from './runner/runTests';
import { thresholdLimits, thresholdForFilesWithoutTests } from './threshold/settings';
import { validateFiles } from './threshold/validate';
import { RunnerType } from './types';

const app = async (argvArray: string[], argvObject: { config?: string; [x: string]: unknown }) => {
  const options = {
    runTime: DateTime.utc(),
    cwdDir: process.cwd(),
    cpuCount: cpus().length,
    cpuUsed: Math.max(1, Math.floor(cpus().length * 0.9)),
    thresholdLimits,
  };

  if (typeof argvObject.config !== 'string') {
    throw new TypeError('The Argument "--config" is missing');
  }

  const jestConfig = await getJestConfig(options.cwdDir, argvObject.config);
  const { config, coverageFrom, thresholdLimits: limits } = normalizeConfig(jestConfig, options);

  options.thresholdLimits = { ...options.thresholdLimits, ...limits };

  const [files, testFiles, runners] = await Promise.all<string[], string[], RunnerType[]>([
    getFileLists([config.rootDir], coverageFrom, () => ''),
    getFileLists(config.roots, config.testMatch, (path: string) => cleanFileFromRootPath(path, config)),
    createRunners(config, options),
  ]);

  // remove all files from ignore patterns
  const files1 = cleanUpByPatterns(files, config.coveragePathIgnorePatterns, config.rootDir);
  // remove all test files
  const files2 = cleanUpByFiles(files1, testFiles);

  outputStatus(files2.length, testFiles.length, options);

  const thresholdData = await runTests(testFiles, runners, argvArray, argvObject.config, config);

  // thresholds.filter((threshold) => Boolean(threshold.error)).map((threshold) => outputError(threshold.error));

  // remove all files with tests
  cleanUpByFiles(
    files2,
    thresholdData.map(({ file }) => file),
  ).forEach((file) => {
    // add files without tests
    thresholdData.push({ file, threshold: thresholdForFilesWithoutTests });
  });

  const status = validateFiles(thresholdData, options.thresholdLimits);

  outputTable(thresholdData, options);
  outputMetrics(status, options);

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(status.error > 0 ? 1 : 0);
};

export default app;
