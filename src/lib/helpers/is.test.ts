import { isObject, isSummary, isGlobalThreshold } from './is';

describe('isObject()', () => {
  test('it should work with object', () => {
    const result = isObject({});

    expect(result).toBe(true);
  });

  test('it should work with number', () => {
    const result = isObject(6);

    expect(result).toBe(false);
  });
});

describe('isSummary()', () => {
  test('it should work with summary object', () => {
    const result = isSummary({ pct: 1, total: 2, covered: 3 });

    expect(result).toBe(true);
  });

  test('it should work without summary object', () => {
    const result = isSummary({});

    expect(result).toBe(false);
  });
});

describe('isGlobalThreshold()', () => {
  test('it should work with global threshold object', () => {
    const result = isGlobalThreshold({ global: {} });

    expect(result).toBe(true);
  });

  test('it should work without global threshold object', () => {
    const result = isGlobalThreshold({});

    expect(result).toBe(false);
  });
});
