import { extendPromise } from '../helpers/commons';
import { cleanFileFromExtensions } from '../helpers/string';
import { RunnerType, RunnerInitializationDataType } from '../types';
import runnerSpawn from './runnerSpawn';

const runnerInitialization = (runner: RunnerType, data: RunnerInitializationDataType) => {
  if (typeof runner.test === 'undefined') {
    const testFile = data.testFiles.shift();

    if (typeof testFile === 'string') {
      // create a new job
      const args = data.argvArray
        .map((argument) => argument.replace(data.configFile, runner.configFile))
        .concat(`--collectCoverageFrom=${cleanFileFromExtensions(testFile)}*`, testFile);

      runner.test = {
        file: testFile,
        ...extendPromise(runnerSpawn(data.command, args, data.config)),
      };

      // isPending?
      return true;
    }
  }

  // isPending?
  return false;
};

export default runnerInitialization;
