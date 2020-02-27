import styling, { statusToType } from './styling';
import chalk = require('chalk');

const proxy = (type: string) => (chars: unknown) => `[${type}]${chars}[/${type}]`;

jest.mock('chalk', () => ({
  red: jest.fn(),
  green: jest.fn(),
  underline: jest.fn(),
  bold: jest.fn(),
}));

beforeEach(() => {
  ((chalk.red as unknown) as jest.Mock).mockImplementation(proxy('red'));
  ((chalk.green as unknown) as jest.Mock).mockImplementation(proxy('green'));
  ((chalk.underline as unknown) as jest.Mock).mockImplementation(proxy('underline'));
  ((chalk.bold as unknown) as jest.Mock).mockImplementation(proxy('bold'));
});

describe('statusToType()', () => {
  test('it should work with status success', () => {
    const type = statusToType('success');

    expect(type).toBe('green');
  });

  test('it should work with status error', () => {
    const type = statusToType('error');

    expect(type).toBe('red');
  });
});

describe('color()', () => {
  test('it should work with type red', () => {
    const result = styling('message', 'red');

    expect(result).toBe('[red]message[/red]');
  });

  test('it should work with type green', () => {
    const result = styling('message', 'green');

    expect(result).toBe('[green]message[/green]');
  });

  test('it should work with type bold', () => {
    const result = styling('message', 'bold');

    expect(result).toBe('[bold]message[/bold]');
  });

  test('it should work with type underline', () => {
    const result = styling('message', 'underline');

    expect(result).toBe('[underline]message[/underline]');
  });

  test('it should work with default status', () => {
    const result = styling('message');

    expect(result).toBe('message');
  });

  test('it should work with number', () => {
    const result = styling(123);

    expect(result).toBe('123');
  });
});
