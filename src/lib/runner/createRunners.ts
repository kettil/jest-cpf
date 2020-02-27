import { createFolder } from '../files/fileSystems';
import { JestConfigType, RunnerType } from '../types';
import createRunner from './createRunner';

const createRunners = async (config: JestConfigType, cpuUsed: number) => {
  const mainFolder = await createFolder(config.rootDir, config.coverageDirectory);
  const promises: Array<Promise<RunnerType>> = [];

  for (let i = 1; i <= cpuUsed; i++) {
    promises.push(createRunner(i, mainFolder, config));
  }

  const runners = await Promise.all(promises);

  return runners;
};

export default createRunners;
