import { DateTime } from 'luxon';
import appExecute from './appExecute';
import { cleanUpByFiles } from './files/cleanUpFiles';
import { getRunTime } from './helpers/time';
import { outputTable, outputMetrics } from './outputs';
import { evaluationFiles } from './threshold/evaluation';
import { thresholdForFilesWithoutTests } from './threshold/settings';
import { UnpackedPromise } from './types';

const appEvaluation = (time: DateTime, data: UnpackedPromise<ReturnType<typeof appExecute>>) => {
  const { cleanedUpFiles, thresholdData, thresholdLimits } = data;

  // remove all files with tests
  cleanUpByFiles(
    cleanedUpFiles,
    thresholdData.map(({ file }) => file),
  ).forEach((file) => {
    // add files without tests
    thresholdData.push({ file, threshold: thresholdForFilesWithoutTests });
  });

  const status = evaluationFiles(thresholdData, thresholdLimits);

  outputTable(thresholdData, thresholdLimits);
  outputMetrics(status, getRunTime(time));

  return status;
};

export default appEvaluation;
