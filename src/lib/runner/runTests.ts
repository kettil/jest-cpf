import { getJestFilename } from '../files/jest';
import { extendPromise, delay, cleanFileFromExtensions } from '../helper';
import { outputProgress } from '../outputs';
import extract from '../threshold/extract';
import { RunnerType, JestConfigType, ThresholdGroupType } from '../types';
import runTest from './runTest';

const runTests = async (
  testFiles: string[],
  runners: RunnerType[],
  argvArray: string[],
  configFile: string,
  config: JestConfigType,
) => {
  let isPending = false;

  const command = await getJestFilename(config.rootDir);
  const thresholds: ThresholdGroupType[] = [];
  const bar = outputProgress(testFiles.length);

  do {
    isPending = false;

    for (const runner of runners) {
      // if a test id defined
      if (typeof runner.test !== 'undefined') {
        // job is ...
        if (runner.test.isPending()) {
          // ... not finish

          isPending = true;
        } else {
          // ... finish
          const resultJest = await runner.test.promise;

          if (typeof resultJest !== 'string') {
            // test threw a error
            thresholds.push({
              file: runner.test.file,
              error: resultJest,
              threshold: { branches: 'ERROR', functions: 'ERROR', lines: 'ERROR', statements: 'ERROR' },
            });
          } else {
            // test has been completed without errors.
            const resultExtract = await extract(runner.coverageFile, runner.test.file, config);

            thresholds.push(...resultExtract);
          }

          bar.increment();
          // clear the test object
          runner.test = undefined;
        }
      }

      if (typeof runner.test === 'undefined' && testFiles.length > 0) {
        // create a new job
        const testFile = testFiles.shift();

        if (testFile) {
          isPending = true;

          const args = argvArray
            .map((argument) => argument.replace(configFile, runner.configFile))
            .concat(`--collectCoverageFrom=${cleanFileFromExtensions(testFile)}*`, testFile);

          runner.test = { file: testFile, ...extendPromise(runTest(command, args, config)) };
        }
      }
    }

    if (isPending) {
      await delay(250);
    }
  } while (testFiles.length > 0 || isPending);

  bar.stop();

  return thresholds;
};

export default runTests;
