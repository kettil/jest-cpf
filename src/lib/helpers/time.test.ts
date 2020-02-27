import { DateTime } from 'luxon';
import { startTime, getRunTime } from './time';

describe('startTime()', () => {
  test('it should work', () => {
    const dateTime = startTime();

    expect(dateTime).toBeInstanceOf(DateTime);
  });
});

describe('getRunTime()', () => {
  test('it should work', () => {
    const dateTime = getRunTime(startTime().minus({ minute: 5, second: 42 }));

    expect(dateTime).toBe('05:42');
  });
});
