import { getJestFilename } from '../files/jest';
import { delay } from '../helper';
import { outputProgress } from '../outputs';
import { RunnerType, JestConfigType, ThresholdGroupType, RunnerDataType } from '../types';
import runnerEvaluation from './runnerEvaluation';
import runnerInitialization from './runnerInitialization';

const runTests = async (
  testFiles: string[],
  runners: RunnerType[],
  argvArray: string[],
  configFile: string,
  config: JestConfigType,
) => {
  let isPending = false;

  const bar = outputProgress(testFiles.length);
  const command = await getJestFilename(config.rootDir);
  const thresholds: ThresholdGroupType[] = [];

  const data: RunnerDataType = {
    testFiles,
    argvArray,
    configFile,
    config,
    command,
    thresholds,
    barIncrement: bar.increment,
  };

  do {
    isPending = false;

    for (const runner of runners) {
      const isPendingEvaluation = await runnerEvaluation(runner, data);
      const isPendingInitialization = runnerInitialization(runner, data);

      isPending = isPending || isPendingEvaluation || isPendingInitialization;
    }

    if (isPending) {
      await delay(250);
    }
  } while (testFiles.length > 0 || isPending);

  bar.stop();

  return thresholds;
};

export default runTests;
