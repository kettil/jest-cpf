import styling, { statusToType } from '../helpers/styling';
import createTableData, { createItem } from './createTableData';

jest.mock('../helpers/styling');

beforeEach(() => {
  (styling as jest.Mock).mockImplementation((m: string, t: string) => `[${t}]${m}[/${t}]`);
  (statusToType as jest.Mock).mockImplementation((s: string) => (s === 'success' ? 'green' : 'red'));
});

describe('createItem()', () => {
  test('it should work with a threshold', () => {
    const threshold = { percent: 80, uncovered: -6 };
    const limit = 90;

    const result = createItem(threshold, limit);

    expect(result).toBe('[red] 80.00[/red]');
  });

  test('it should work with error', () => {
    const threshold = 'ERROR';
    const limit = 90;

    const result = createItem(threshold, limit);

    expect(result).toBe('[red]ERROR[/red]');
  });
});

describe('createTableData()', () => {
  test('it should work', () => {
    const thresholdLimits = { statements: 90, branches: 70, functions: -5, lines: -10 };
    const thresholds = [
      {
        file: 'src/lib/app.ts',
        threshold: {
          statements: { percent: 80, uncovered: -6 },
          branches: { percent: 80, uncovered: -6 },
          functions: { percent: 80, uncovered: -6 },
          lines: { percent: 80, uncovered: -6 },
        },
      },
      {
        file: 'src/index.ts',
        threshold: {
          statements: { percent: 80, uncovered: -6 },
          branches: { percent: 80, uncovered: -6 },
          functions: { percent: 80, uncovered: -6 },
          lines: { percent: 80, uncovered: -6 },
        },
      },
    ];

    const result = createTableData(thresholds, thresholdLimits);

    expect(result).toEqual([
      [
        '[bold]#[/bold]',
        '[bold]File[/bold]',
        '[bold]% Stmts[/bold]',
        '[bold]% Branch[/bold]',
        '[bold]% Funcs[/bold]',
        '[bold]% Lines[/bold]',
      ],
      [
        '1',
        'src/[bold]index.ts[/bold]',
        '[red] 80.00[/red]',
        '[green] 80.00[/green]',
        '[green] 80.00[/green]',
        '[green] 80.00[/green]',
      ],
      [
        '2',
        'src/lib/[bold]app.ts[/bold]',
        '[red] 80.00[/red]',
        '[green] 80.00[/green]',
        '[green] 80.00[/green]',
        '[green] 80.00[/green]',
      ],
    ]);
  });
});
