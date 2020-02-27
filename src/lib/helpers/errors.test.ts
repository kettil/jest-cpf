import { TestError } from './errors';

describe('testError()', () => {
  test('it should work with data string', () => {
    const instance = new TestError('error-message', 'data-message');

    expect(instance).toBeInstanceOf(Error);
    expect(instance.message).toBe('error-message');
    expect(instance.data).toBe('data-message');
  });

  test('it should work without data string', () => {
    const instance = new TestError('error-message');

    expect(instance).toBeInstanceOf(Error);
    expect(instance.message).toBe('error-message');
    expect(instance.data).toBe('');
  });
});
