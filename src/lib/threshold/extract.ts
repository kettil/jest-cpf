import { readJsonFile } from '../files/json';
import { isObject, isSummary } from '../helpers/is';
import { cleanFileFromExtensions, cleanFileFromRootPath } from '../helpers/string';
import { ThresholdGroupType, ThresholdType, ThresholdKeysType, CoverageSummaryType, JestConfigType } from '../types';
import { thresholdKeys } from './settings';

export const getSummaryObject = (fileData: unknown, type: ThresholdKeysType): CoverageSummaryType | undefined => {
  if (isObject(fileData)) {
    const data = fileData[type];

    return isSummary(data) ? data : undefined;
  }

  return undefined;
};

const extract = async (
  pathCoverage: string,
  testFile: string,
  config: JestConfigType,
): Promise<ThresholdGroupType[]> => {
  const json = await readJsonFile(pathCoverage);
  const files: ThresholdGroupType[] = [];
  const testFileShort = cleanFileFromExtensions(testFile);

  for (const file of Object.keys(json)) {
    const fileShort = cleanFileFromRootPath(file, config.rootDir);

    if (cleanFileFromExtensions(fileShort) === testFileShort) {
      const threshold: ThresholdType = { branches: 'ERROR', functions: 'ERROR', lines: 'ERROR', statements: 'ERROR' };
      const data = json[file];

      for (const type of thresholdKeys) {
        const summary = getSummaryObject(data, type);

        if (summary) {
          threshold[type] = {
            percent: summary.pct,
            uncovered: summary.total - summary.covered,
          };
        }
      }

      files.push({
        file: fileShort,
        threshold,
      });
    }
  }

  return files;
};

export default extract;
