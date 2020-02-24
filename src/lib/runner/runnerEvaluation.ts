import extract from '../threshold/extract';
import { RunnerType, RunnerEvaluationDataType } from '../types';

const runnerEvaluation = async (runner: RunnerType, data: RunnerEvaluationDataType) => {
  if (typeof runner.test !== 'undefined') {
    // job is ...
    if (runner.test.isPending()) {
      // ... not finish

      // isPending?
      return true;
    }

    // ... finish
    const resultJest = await runner.test.promise;

    if (typeof resultJest !== 'string') {
      // test threw a error
      data.thresholds.push({
        file: runner.test.file,
        error: resultJest,
        threshold: { branches: 'ERROR', functions: 'ERROR', lines: 'ERROR', statements: 'ERROR' },
      });
    } else {
      // test has been completed without errors.
      const resultExtract = await extract(runner.coverageFile, runner.test.file, data.config);

      data.thresholds.push(...resultExtract);
    }

    data.barIncrement();
    // clear the test object
    runner.test = undefined;
  }

  // isPending?
  return false;
};

export default runnerEvaluation;
