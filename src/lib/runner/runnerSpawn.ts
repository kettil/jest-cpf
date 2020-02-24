import { spawn } from 'child_process';
import { TestError } from '../helper';
import { JestConfigType } from '../types';

const runnerSpawn = (command: string, args: string[], config: JestConfigType) =>
  new Promise<string>((resolve, reject) => {
    const jest = spawn(command, args, { cwd: config.rootDir });

    let stringData = '';

    jest.stdout.on('data', (data) => {
      stringData += data;
    });

    jest.stderr.on('data', (data) => {
      stringData += data;
    });

    jest.on('close', (code) => {
      if (code === 0) {
        resolve(stringData.trim());
      } else {
        reject(new TestError('Jest running error', stringData.trim()));
      }
    });
  });

export default runnerSpawn;
