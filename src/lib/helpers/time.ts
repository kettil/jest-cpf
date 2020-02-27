import { DateTime } from 'luxon';

export const startTime = () => DateTime.utc();

export const getRunTime = (time: DateTime) => {
  const runtime = DateTime.utc().diff(time, ['minutes', 'seconds']);

  return runtime.toFormat('mm:ss');
};
