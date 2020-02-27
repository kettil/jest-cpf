import { ExtendPromiseType } from '../types';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms, ms));

export const extendPromise = <T>(promise: Promise<T>): ExtendPromiseType<T | Error> => {
  let isPending = true;

  return {
    isPending: () => isPending,
    promise: new Promise<T | Error>((resolve) => {
      promise.then(
        (v: T) => {
          isPending = false;
          resolve(v);
        },
        (error: Error) => {
          isPending = false;
          resolve(error);
        },
      );
    }),
  };
};
