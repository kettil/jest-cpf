import { ThresholdColorType } from '../types';
import chalk = require('chalk');

type ChalkType = 'underline' | 'red' | 'green' | 'bold';

export const statusToType = (status: ThresholdColorType): ChalkType => {
  switch (status) {
    case 'success':
      return 'green';

    case 'error':
    default:
      return 'red';
  }
};

const styling = (text: string | number, type?: ChalkType): string => {
  if (typeof text === 'number') {
    text = text.toString();
  }

  switch (type) {
    case 'green':
      return chalk.green(text);

    case 'red':
      return chalk.red(text);

    case 'underline':
      return chalk.underline(text);

    case 'bold':
      return chalk.bold(text);

    default:
      return text;
  }
};

export default styling;
