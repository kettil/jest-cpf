import { join, dirname, basename } from 'path';

export const cleanFileFromRootPath = (file: string, rootDirectory: string) =>
  file.slice(Math.max(0, rootDirectory.length + 1));

export const cleanFileFromExtensions = (file: string) => {
  const path = dirname(file);
  const base = basename(file);
  const name = base.slice(0, Math.max(0, base.indexOf('.') + 1));

  return join(path, name);
};

export const mapPerLine = (value: string, callback: (line: string) => string) =>
  value
    .split('\n')
    .map(callback)
    .join('\n');

export const padFill = (value: string, length: number, fill: string) =>
  [...new Array(Math.max(0, length - value.length))].fill(fill).join('');

export const padLeft = (value: string, length: number, fill: string): string => padFill(value, length, fill) + value;

export const padRight = (value: string, length: number, fill: string): string => value + padFill(value, length, fill);

export const formatPercent = (value: number): string => {
  const [pre, post = ''] = value.toString().split('.');

  return [padLeft(pre, 3, ' '), padRight(post, 2, '0')].join('.');
};
