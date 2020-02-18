/* eslint-disable no-console */
import chalk = require('chalk');
import { SingleBar } from 'cli-progress';
import { DateTime } from 'luxon';
import { table } from 'table';
import { TestError, padLeft, color, mapPerLine } from './helper';
import createTableData from './threshold/createTableData';
import { tableConfig } from './threshold/settings';
import { OutputOptionsType, ThresholdColorType, ThresholdGroupType } from './types';

export const outputError = (error: unknown) => {
  if (error instanceof Error) {
    if (error instanceof TestError) {
      console.error(color('|> An error was thrown during testing!'));
      console.error(color('|> '));
      console.error(color('|> Output'));
      console.error(color('|> '));
      console.error(mapPerLine(error.data, (line) => color('|> ') + line));
    } else {
      console.error(mapPerLine(error.stack ?? `Error: ${error.message}`, (line) => color('|> ') + line));
    }
  } else {
    console.error(error);
  }

  console.log('');
};

export const outputMetrics = (status: Record<ThresholdColorType, number>, options: OutputOptionsType) => {
  const types = Object.keys(status) as ThresholdColorType[];
  const maxChars = types.reduce((p, c) => Math.max(p, status[c]), 0).toString().length;

  console.log(chalk.underline('Summary'));
  console.log(`├─ Success: ${color(padLeft(status.success.toString(), maxChars, ' '), 'success')}`);
  console.log(`└─ Error:   ${color(padLeft(status.error.toString(), maxChars, ' '), 'error')}`);
  console.log('');

  const runtime = DateTime.utc().diff(options.runTime, ['minutes', 'seconds']);

  console.log(`Runtime: ${runtime.toFormat('mm:ss')} (mm:ss)`);
  console.log('');
};

export const outputProgress = (count: number) => {
  const bar = new SingleBar({
    format: `${color('{bar}')} {percentage}% | {value}/{total} Files`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  bar.start(count, 0);

  /*
  return {
    increment: () => ({}),
    stop: () => ({}),
  };
  //*/

  return {
    increment: () => bar.increment(),
    stop: () => {
      bar.stop();
      console.log('');
    },
  };
};

export const outputStatus = (countFiles: number, countTestFiles: number, options: OutputOptionsType) => {
  console.log('');
  console.info(`CPU detected: ${color(options.cpuCount)} (${color(options.cpuUsed)} are used)`);
  console.info(`Files found:  ${color(countFiles)} (${color(countTestFiles)} with tests)`);
  console.log('');
};

export const outputTable = (thresholds: ThresholdGroupType[], options: OutputOptionsType) => {
  const thresholdRows = createTableData(thresholds, options.thresholdLimits);
  const output = table(thresholdRows, tableConfig);

  console.log(output);
};
