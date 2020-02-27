import { delay, extendPromise } from './commons';

describe('delay()', () => {
  test('it should work', async () => {
    const ms = Date.now();

    const promise = delay(250);

    await expect(promise).resolves.toBe(250);

    expect(Date.now() - ms).toBeGreaterThanOrEqual(250);
  });
});

describe('extendPromise()', () => {
  let next: (value?: string) => void;

  test('it should work with resolve', async () => {
    const result = extendPromise(
      new Promise((resolve) => {
        next = resolve;
      }),
    );

    expect(result).toEqual({ isPending: expect.any(Function), promise: expect.any(Promise) });
    expect(result.isPending()).toBe(true);

    next('success');

    await delay(100);

    expect(result.isPending()).toBe(false);

    await expect(result.promise).resolves.toBe('success');
  });

  test('it should work with reject', async () => {
    const result = extendPromise(
      new Promise((_, reject) => {
        next = reject;
      }),
    );

    expect(result).toEqual({ isPending: expect.any(Function), promise: expect.any(Promise) });
    expect(result.isPending()).toBe(true);

    next('error');

    await delay(100);

    expect(result.isPending()).toBe(false);

    await expect(result.promise).resolves.toBe('error');
  });
});
