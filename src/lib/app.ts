import { cpus } from 'os';
import appEvaluation from './appEvaluation';
import appExecute from './appExecute';
import { startTime } from './helpers/time';
import { ArgvObjectType } from './types';

const app = async (argvArray: string[], argvObject: ArgvObjectType) => {
  const time = startTime();

  const cpuCount = cpus().length;
  const cpuUsed = Math.max(1, Math.floor(cpuCount * 0.9));

  const data = await appExecute(argvArray, argvObject, process.cwd(), cpuCount, cpuUsed);
  const status = appEvaluation(time, data);

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(status.error > 0 ? 1 : 0);
};

export default app;
