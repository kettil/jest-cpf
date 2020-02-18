import { TableUserConfig } from 'table';
import { ThresholdValueType, ThresholdType } from '../types';

export const thresholdKeys = ['statements', 'branches', 'functions', 'lines'] as const;

export const thresholdLimits = {
  branches: 95,
  functions: 95,
  lines: 95,
  statements: 95,
};

const thresholdValue: ThresholdValueType = { percent: 0, uncovered: Infinity };

export const thresholdForFilesWithoutTests: ThresholdType = {
  branches: thresholdValue,
  functions: thresholdValue,
  lines: thresholdValue,
  statements: thresholdValue,
};

export const tableConfig: TableUserConfig = {
  drawHorizontalLine: (index, size) => index === 0 || index === 1 || index === size,
  columns: {
    0: { alignment: 'right' },
    1: { alignment: 'left' },
    2: { alignment: 'right' },
    3: { alignment: 'right' },
    4: { alignment: 'right' },
  },
  border: {
    topBody: '─',
    topJoin: '┬',
    topLeft: '',
    topRight: '',

    bottomBody: '─',
    bottomJoin: '┴',
    bottomLeft: '',
    bottomRight: '',

    bodyLeft: '',
    bodyRight: '',
    bodyJoin: '│',

    joinBody: '─',
    joinLeft: '',
    joinRight: '',
    joinJoin: '┼',
  },
};
