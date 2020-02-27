import { DateTime } from 'luxon';
import appEvaluation from './appEvaluation';
import { getRunTime } from './helpers/time';
import { outputTable, outputMetrics } from './outputs';
import { evaluationFiles } from './threshold/evaluation';

jest.mock('./outputs');
jest.mock('./threshold/evaluation');
jest.mock('./helpers/time');

const evaluationFilesMock = evaluationFiles as jest.Mock;
const outputMetricsMock = outputMetrics as jest.Mock;
const outputTableMock = outputTable as jest.Mock;
const getRunTimeMock = getRunTime as jest.Mock;

describe('appEvaluation()', () => {
  test('it should work', () => {
    const time = (jest.fn() as unknown) as DateTime;
    const data = {
      thresholdLimits: { branches: 95, functions: 95, lines: 95, statements: 95 },
      cleanedUpFiles: ['/path/to/project/src/index.ts', '/path/to/project/src/app.ts'],
      thresholdData: [
        {
          file: '/path/to/project/src/index.ts',
          threshold: {
            branches: { percent: 90, uncovered: 3 },
            functions: { percent: 90, uncovered: 3 },
            lines: { percent: 100, uncovered: 3 },
            statements: { percent: 90, uncovered: 3 },
          },
        },
      ],
    };

    evaluationFilesMock.mockReturnValueOnce({ error: 6, success: 8 });
    getRunTimeMock.mockReturnValueOnce('13:42');

    const status = appEvaluation(time, data);

    expect(status).toEqual({ error: 6, success: 8 });

    expect(evaluationFilesMock).toHaveBeenCalledTimes(1);
    expect(evaluationFilesMock).toMatchSnapshot('evaluationFiles');

    expect(outputMetricsMock).toHaveBeenCalledTimes(1);
    expect(outputMetricsMock).toMatchSnapshot('outputMetrics');

    expect(outputTableMock).toHaveBeenCalledTimes(1);
    expect(outputTableMock).toMatchSnapshot('outputTable');

    expect(getRunTimeMock).toHaveBeenCalledTimes(1);
  });
});
