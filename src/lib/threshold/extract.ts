import { readJsonFile } from '../files/json';
import { isObject, isSummary, cleanFileFromExtensions, cleanFileFromRootPath } from '../helper';
import { ThresholdGroupType, ThresholdType, ThresholdKeysType, CoverageSummaryType, JestConfigType } from '../types';
import { thresholdKeys } from './settings';

const getSummaryObject = (fileData: unknown, type: ThresholdKeysType): CoverageSummaryType | undefined => {
  if (isObject(fileData)) {
    const data = fileData[type];

    return isSummary(data) ? data : undefined;
  }

  return undefined;
};

const extract = async (coverage: string, testFile: string, config: JestConfigType): Promise<ThresholdGroupType[]> => {
  const json = await readJsonFile(coverage);
  const files: ThresholdGroupType[] = [];
  const testFileShort = cleanFileFromExtensions(testFile);

  for (const file of Object.keys(json)) {
    const fileShort = cleanFileFromRootPath(file, config);

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
