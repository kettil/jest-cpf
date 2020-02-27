import { dirname, basename, join } from 'path';
import { formatPercent } from '../helpers/string';
import styling, { statusToType } from '../helpers/styling';
import { ThresholdGroupType, ThresholdType, ThresholdRowType, ThresholdValueType } from '../types';
import { evaluationFileStatus } from './evaluation';
import { thresholdKeys } from './settings';
import sort from './sort';

export const createItem = (value: ThresholdValueType, limit: number) => {
  const status = evaluationFileStatus(value, limit);
  const text = typeof value === 'object' ? formatPercent(value.percent) : value;

  return styling(text, statusToType(status));
};

const createTableData = (
  thresholds: ThresholdGroupType[],
  thresholdLimits: ThresholdType<number>,
): ThresholdRowType[] => {
  const title = ['#', 'File', '% Stmts', '% Branch', '% Funcs', '% Lines'];
  const items: ThresholdRowType[] = [title.map((t) => styling(t, 'bold'))];

  thresholds.sort(sort);
  thresholds.forEach((threshold, index) => {
    const file = threshold.file;
    const item: ThresholdRowType = [(index + 1).toString(), join(dirname(file), styling(basename(file), 'bold'))];

    for (const key of thresholdKeys) {
      item.push(createItem(threshold.threshold[key], thresholdLimits[key]));
    }

    items.push(item);
  });

  return items;
};

export default createTableData;
