export class TestError extends Error {
  readonly data: string;

  constructor(message?: string, data = '') {
    super(message);

    this.data = data;
  }
}
