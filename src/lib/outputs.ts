/* eslint-disable no-console */
import { SingleBar } from 'cli-progress';
import { table } from 'table';
import { TestError } from './helpers/errors';
import { padLeft, mapPerLine } from './helpers/string';
import styling from './helpers/styling';
import createTableData from './threshold/createTableData';
import { tableConfig } from './threshold/settings';
import { ThresholdColorType, ThresholdGroupType, BarReturnType, ThresholdType } from './types';

export const outputError = (error: unknown) => {
  if (error instanceof Error) {
    if (error instanceof TestError) {
      console.error(styling('|> An error was thrown during testing!', 'red'));
      console.error(styling('|> ', 'red'));
      console.error(styling('|> Output', 'red'));
      console.error(styling('|> ', 'red'));
      console.error(mapPerLine(error.data, (line) => styling('|> ', 'red') + line));
    } else {
      console.error(mapPerLine(error.stack ?? `Error: ${error.message}`, (line) => styling('|> ', 'red') + line));
    }
  } else {
    console.error(error);
  }

  console.log('');
};

export const outputMetrics = (status: Record<ThresholdColorType, number>, runtime: string) => {
  const types = Object.keys(status) as ThresholdColorType[];
  const maxChars = types.reduce((p, c) => Math.max(p, status[c]), 0).toString().length;

  console.log(styling('Summary', 'underline'));
  console.log(`├─ Success: ${styling(padLeft(status.success.toString(), maxChars, ' '), 'green')}`);
  console.log(`└─ Error:   ${styling(padLeft(status.error.toString(), maxChars, ' '), 'red')}`);
  console.log('');

  console.log(`Runtime: ${runtime} (mm:ss)`);
  console.log('');
};

export const outputProgress = (count: number): BarReturnType => {
  const bar = new SingleBar({
    format: `${styling('{bar}', 'red')} {percentage}% | {value}/{total} Files`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  bar.start(count, 0);

  return {
    increment: () => bar.increment(),
    stop: () => {
      bar.stop();
      console.log('');
    },
  };
};

export const outputStatus = (countFiles: number, countTestFiles: number, cpuCount: number, cpuUsed: number) => {
  console.log('');
  console.log(`CPU detected: ${styling(cpuCount, 'red')} (${styling(cpuUsed, 'red')} are used)`);
  console.log(`Files found:  ${styling(countFiles, 'red')} (${styling(countTestFiles, 'red')} with tests)`);
  console.log('');
};

export const outputTable = (thresholds: ThresholdGroupType[], thresholdLimits: ThresholdType<number>) => {
  const thresholdRows = createTableData(thresholds, thresholdLimits);

  console.log(table(thresholdRows, tableConfig));
};
