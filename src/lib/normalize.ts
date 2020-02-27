import { normalize } from 'path';
import { isGlobalThreshold } from './helpers/is';
import { thresholdKeys } from './threshold/settings';
import { JestConfigType, ThresholdType } from './types';

export const getCoverageDirectory = (config: Record<string, unknown>) =>
  typeof config.coverageDirectory === 'string' ? config.coverageDirectory : '.coverage';

export const getCoveragePathIgnorePatterns = (config: Record<string, unknown>) =>
  Array.isArray(config.coveragePathIgnorePatterns) ? config.coveragePathIgnorePatterns : [];

export const getRootDirectory = (config: Record<string, unknown>, cwdDirectory: string) =>
  typeof config.rootDir === 'string' ? normalize(config.rootDir) : cwdDirectory;

export const getRoots = (config: Record<string, unknown>, rootDirectory: string) => {
  if (Array.isArray(config.roots)) {
    return config.roots.map((path) => path.replace('<rootDir>', normalize(rootDirectory)));
  }

  return [rootDirectory];
};

export const getThresholdLimits = (config: Record<string, unknown>) => {
  const thresholdLimits: Partial<ThresholdType<number>> = {};

  if (isGlobalThreshold(config.coverageThreshold)) {
    const threshold = config.coverageThreshold.global;

    thresholdKeys.forEach((key) => {
      const value = threshold[key];

      if (typeof value === 'number') {
        thresholdLimits[key] = value;
      }
    });
  }

  return thresholdLimits;
};

const normalizeConfig = (
  config: Record<string, unknown>,
  cwdDirectory: string,
): JestConfigType & { thresholdLimits: Partial<ThresholdType<number>> } => {
  if (!Array.isArray(config.testMatch)) {
    throw new TypeError('The jest config parameter "testMatch" is missing');
  }

  if (!Array.isArray(config.collectCoverageFrom)) {
    throw new TypeError('The jest config parameter "collectCoverageFrom" is missing');
  }

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const rootDir = getRootDirectory(config, cwdDirectory);
  const roots = getRoots(config, rootDir);
  const testMatch = config.testMatch;
  const collectCoverageFrom = config.collectCoverageFrom;
  const coverageDirectory = getCoverageDirectory(config);
  const coveragePathIgnorePatterns = getCoveragePathIgnorePatterns(config);

  const thresholdLimits = getThresholdLimits(config);

  return {
    ...config,

    testMatch,
    rootDir,
    roots,

    collectCoverage: true,
    collectCoverageFrom,
    coverageDirectory,
    coverageReporters: ['json-summary'],
    coverageThreshold: { global: { branches: 0, functions: 0, lines: 0, statements: 0 } },
    coveragePathIgnorePatterns,

    thresholdLimits,
  };
};

export default normalizeConfig;
