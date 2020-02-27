import {
  thresholdKeys,
  thresholdDefaultLimits,
  thresholdForFilesWithoutTests,
  tableConfig,
  drawHorizontalLine,
} from './settings';

describe('properties', () => {
  test('thresholdKeys', () => {
    expect(thresholdKeys).toEqual(['statements', 'branches', 'functions', 'lines']);
  });

  test('thresholdLimits', () => {
    expect(thresholdDefaultLimits).toEqual({
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    });
  });

  test('thresholdForFilesWithoutTests', () => {
    expect(thresholdForFilesWithoutTests).toEqual({
      branches: { percent: 0, uncovered: Infinity },
      functions: { percent: 0, uncovered: Infinity },
      lines: { percent: 0, uncovered: Infinity },
      statements: { percent: 0, uncovered: Infinity },
    });
  });

  test('tableConfig', () => {
    expect(tableConfig).toEqual({
      border: {
        bodyJoin: '│',
        bodyLeft: '',
        bodyRight: '',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '',
        bottomRight: '',
        joinBody: '─',
        joinJoin: '┼',
        joinLeft: '',
        joinRight: '',
        topBody: '─',
        topJoin: '┬',
        topLeft: '',
        topRight: '',
      },
      columns: {
        0: { alignment: 'right' },
        1: { alignment: 'left' },
        2: { alignment: 'right' },
        3: { alignment: 'right' },
        4: { alignment: 'right' },
      },
      drawHorizontalLine: expect.any(Function),
    });
  });
});

describe('drawHorizontalLine()', () => {
  test.each([
    [0, 4, true],
    [1, 4, true],
    [2, 4, false],
    [3, 4, false],
    [4, 4, true],
  ])('it should work with %p and %p', (index, size, expected) => {
    const result = drawHorizontalLine(index, size);

    expect(result).toBe(expected);
  });
});
