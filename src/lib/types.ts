import { thresholdKeys } from './threshold/settings';

export type ExtendPromiseType<T> = { promise: Promise<T | Error>; isPending: () => boolean };

export type ArgvObjectType = { config?: string; [x: string]: unknown };

export type RunnerType = {
  configFile: string;
  coverageFile: string;

  test?: {
    file: string;
  } & ExtendPromiseType<string>;
};

export type RunnerEvaluationDataType = {
  thresholds: ThresholdGroupType[];
  config: JestConfigType;
  barIncrement: BarReturnType['increment'];
};

export type RunnerInitializationDataType = {
  testFiles: string[];
  argvArray: string[];
  configFile: string;
  config: JestConfigType;
  command: string;
};

export type RunnerDataType = RunnerEvaluationDataType & RunnerInitializationDataType;

export type BarReturnType = {
  increment: () => void;
  stop: () => void;
};

export type JestConfigType = {
  testMatch: string[];
  rootDir: string;
  roots: string[];

  collectCoverage: true;
  collectCoverageFrom: string[];
  coverageDirectory: string;
  coverageReporters: string[];
  coverageThreshold: { global: ThresholdType<number> };
  coveragePathIgnorePatterns: string[];

  [x: string]: unknown;
};

export type CoverageSummaryType = {
  pct: number;
  total: number;
  covered: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThresholdKeysType = typeof thresholdKeys[any];
export type ThresholdColorType = 'success' | 'error';
export type ThresholdErrorTypes = 'ERROR';
export type ThresholdValueType = { percent: number; uncovered: number } | ThresholdErrorTypes;
export type ThresholdRowType = string[];
export type ThresholdType<T = ThresholdValueType> = Record<ThresholdKeysType, T>;
export type ThresholdGroupType<T = ThresholdValueType> = {
  file: string;
  threshold: ThresholdType<T>;
  error?: unknown;
};

//
// helper
//

export type UnpackedPromise<T> = T extends Promise<infer U> ? U : T;
