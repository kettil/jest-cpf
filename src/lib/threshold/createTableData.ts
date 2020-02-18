import chalk = require('chalk');
import { dirname, basename, join } from 'path';
import { formatPercent, color } from '../helper';
import { ThresholdGroupType, ThresholdType, ThresholdRowType, ThresholdValueType } from '../types';
import { thresholdKeys } from './settings';
import sort from './sort';
import { validateFileStatus } from './validate';

const createItem = (value: ThresholdValueType, limit: number) => {
  const status = validateFileStatus(value, limit);
  const text = typeof value === 'object' ? formatPercent(value.percent) : value;

  return color(text, status);
};

const createTableData = (
  thresholds: ThresholdGroupType[],
  thresholdLimits: ThresholdType<number>,
): ThresholdRowType[] => {
  const title = ['#', 'File', '% Stmts', '% Branch', '% Funcs', '% Lines'];
  const items: ThresholdRowType[] = [title.map((t) => chalk.bold(t))];

  thresholds.sort(sort);
  thresholds.forEach((threshold, index) => {
    const file = threshold.file;
    const item: ThresholdRowType = [(index + 1).toString(), join(dirname(file), chalk.bold(basename(file)))];

    for (const key of thresholdKeys) {
      item.push(createItem(threshold.threshold[key], thresholdLimits[key]));
    }

    items.push(item);
  });

  return items;
};

export default createTableData;
