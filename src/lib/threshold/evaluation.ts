import { ThresholdColorType, ThresholdGroupType, ThresholdType, ThresholdValueType } from '../types';
import { thresholdKeys } from './settings';

export const isSuccess = (percent: number, lines: number, limit: number) =>
  (limit < 0 && -1 * lines >= limit) || (limit >= 0 && percent >= limit);

export const evaluationFileStatus = (value: ThresholdValueType, limit: number): ThresholdColorType => {
  if (typeof value === 'object') {
    const percent = value.percent;
    const lines = value.uncovered;

    switch (true) {
      case isSuccess(percent, lines, limit):
        return 'success';

      default:
        return 'error';
    }
  }

  return 'error';
};

export const evaluationFile = (
  threshold: ThresholdGroupType,
  thresholdValue: ThresholdType<number>,
): ThresholdColorType => {
  for (const key of thresholdKeys) {
    const value = threshold.threshold[key];
    const limit = thresholdValue[key];
    const status = evaluationFileStatus(value, limit);

    if (status === 'error') {
      return status;
    }
  }

  return 'success';
};

export const evaluationFiles = (thresholds: ThresholdGroupType[], thresholdValue: ThresholdType<number>) => {
  const data: Record<ThresholdColorType, number> = { success: 0, error: 0 };

  for (const threshold of thresholds) {
    data[evaluationFile(threshold, thresholdValue)] += 1;
  }

  return data;
};
