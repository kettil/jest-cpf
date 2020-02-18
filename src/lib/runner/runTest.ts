import { spawn } from 'child_process';
import { TestError } from '../helper';
import { JestConfigType } from '../types';

const runTest = (command: string, args: string[], config: JestConfigType) =>
  new Promise<string>((resolve, reject) => {
    const ls = spawn(command, args, { cwd: config.rootDir });

    let stringData = '';

    ls.stdout.on('data', (data) => {
      stringData += data;
    });

    ls.stderr.on('data', (data) => {
      stringData += data;
    });

    ls.on('close', (code) => {
      if (code === 0 || stringData.includes('Ran all test suites matching')) {
        return resolve(stringData.trim());
      }

      return reject(new TestError('jest error', stringData.trim()));
    });
  });

export default runTest;
