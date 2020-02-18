import chalk = require('chalk');
import { join, dirname, basename } from 'path';
import { ExtendPromiseType, CoverageSummaryType, ThresholdColorType, JestConfigType } from './types';

export class TestError extends Error {
  readonly data: string;

  constructor(message?: string, data = '') {
    super(message);

    this.data = data;
  }
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const extendPromise = <T>(promise: Promise<T>): ExtendPromiseType<T | Error> => {
  let isPending = true;

  return {
    isPending: () => isPending,
    promise: new Promise<T | Error>((resolve) => {
      promise.then(
        (v: T) => {
          isPending = false;
          resolve(v);
        },
        (error: Error) => {
          isPending = false;
          resolve(error);
        },
      );
    }),
  };
};

export const mapPerLine = (value: string, callback: (line: string) => string) =>
  value
    .split('\n')
    .map(callback)
    .join('\n');

export const padLeft = (value: string, length: number, fill: string): string =>
  [...new Array(Math.max(0, length - value.length))].fill(fill).join('') + value;

export const formatPercent = (value: number): string => {
  const [pre, post = ''] = value.toString().split('.');

  return [padLeft(pre, 3, ' '), padLeft(post, 2, '0')].join('.');
};

export const color = (text: string | number, status: ThresholdColorType = 'error') => {
  switch (status) {
    case 'success':
      return chalk.green(text);

    default:
      return chalk.red(text);
  }
};

export const cleanFileFromRootPath = (file: string, config: JestConfigType) =>
  file.slice(Math.max(0, config.rootDir.length + 1));

export const cleanFileFromExtensions = (file: string) => {
  const path = dirname(file);
  const base = basename(file);
  const name = base.slice(0, Math.max(0, base.indexOf('.') + 1));

  return join(path, name);
};

export const isObject = (data: unknown): data is Record<string, unknown> => typeof data === 'object' && data !== null;

export const isSummary = (data: unknown): data is CoverageSummaryType =>
  isObject(data) && typeof data.pct === 'number' && typeof data.total === 'number' && typeof data.covered === 'number';

export const isGlobalThreshold = (threshold: unknown): threshold is { global: Record<string, unknown> } =>
  isObject(threshold) && isObject(threshold.global);
