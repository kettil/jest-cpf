import app from './lib/app';
import index from '.';

describe('check the index file', () => {
  test('it should index default export is equal app default export', () => {
    expect(index).toBe(app);
  });
});
