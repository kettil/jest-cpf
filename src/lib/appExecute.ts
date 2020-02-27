import cleanUpFiles from './files/cleanUpFiles';
import getFileLists from './files/fileLists';
import { getJestConfig } from './files/jest';
import { cleanFileFromRootPath } from './helpers/string';
import normalizeConfig from './normalize';
import { outputStatus } from './outputs';
import createRunners from './runner/createRunners';
import runTests from './runner/runTests';
import { thresholdDefaultLimits } from './threshold/settings';
import { RunnerType, ArgvObjectType } from './types';

export const getFileListsCallback = (rootDirectory?: string) => {
  if (typeof rootDirectory === 'string') {
    return (path: string) => cleanFileFromRootPath(path, rootDirectory);
  }

  return () => '';
};

const appExecute = async (
  argvArray: string[],
  argvObject: ArgvObjectType,
  cwdDirectory: string,
  cpuCount: number,
  cpuUsed: number,
) => {
  if (typeof argvObject.config !== 'string') {
    throw new TypeError('The Argument "--config" is missing');
  }

  const jestConfig = await getJestConfig(cwdDirectory, argvObject.config);
  const { thresholdLimits, ...config } = normalizeConfig(jestConfig, cwdDirectory);

  const [files, testFiles, runners] = await Promise.all<string[], string[], RunnerType[]>([
    getFileLists([config.rootDir], config.collectCoverageFrom, getFileListsCallback()),
    getFileLists(config.roots, config.testMatch, getFileListsCallback(config.rootDir)),
    createRunners(config, cpuUsed),
  ]);

  const cleanedUpFiles = cleanUpFiles(files, testFiles, config);

  outputStatus(cleanedUpFiles.length, testFiles.length, cpuCount, cpuUsed);

  const thresholdData = await runTests(testFiles, runners, argvArray, argvObject.config, config);

  return { cleanedUpFiles, thresholdData, thresholdLimits: { ...thresholdDefaultLimits, ...thresholdLimits } };
};

export default appExecute;
