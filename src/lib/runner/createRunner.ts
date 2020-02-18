import { join } from 'path';
import { createFolder } from '../files/fileSystems';
import { writeJsonFile } from '../files/json';
import { JestConfigType, RunnerType } from '../types';

const createRunner = async (i: number, mainFolder: string, config: JestConfigType): Promise<RunnerType> => {
  const childFolder = await createFolder(mainFolder, i);
  const childConfig = { ...config, coverageDirectory: childFolder };
  const childConfigFile = join(childFolder, 'config.json');

  await writeJsonFile(childConfigFile, childConfig);

  return {
    configFile: childConfigFile,
    coverageFile: join(childFolder, 'coverage-summary.json'),
  };
};

export default createRunner;
