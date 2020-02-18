import { normalize } from 'path';
import { isGlobalThreshold } from './helper';
import { thresholdKeys } from './threshold/settings';
import { JestConfigType, OutputOptionsType, ThresholdType } from './types';

const normalizeConfig = (
  config: Record<string, unknown>,
  options: OutputOptionsType,
): { config: JestConfigType; coverageFrom: string[]; thresholdLimits: Partial<ThresholdType<number>> } => {
  if (!Array.isArray(config.testMatch)) {
    throw new TypeError('The jest config parameter "testMatch" is missing');
  }

  if (!Array.isArray(config.collectCoverageFrom)) {
    throw new TypeError('The jest config parameter "collectCoverageFrom" is missing');
  }

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const rootDir = typeof config.rootDir === 'string' ? normalize(config.rootDir) : options.cwdDir;
  const testMatch = config.testMatch;
  const coverageFrom = config.collectCoverageFrom;
  const coverageDirectory = typeof config.coverageDirectory === 'string' ? config.coverageDirectory : '.coverage';
  const coveragePathIgnore = Array.isArray(config.coveragePathIgnorePatterns) ? config.coveragePathIgnorePatterns : [];

  let roots;

  if (Array.isArray(config.roots)) {
    roots = config.roots.map((path) => path.replace('<rootDir>', normalize(rootDir)));
  } else {
    roots = [rootDir];
  }

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

  return {
    coverageFrom,
    thresholdLimits,
    config: {
      ...config,

      testMatch,
      rootDir,
      roots,

      collectCoverage: true,
      coverageDirectory,
      coverageReporters: ['json-summary'],
      coverageThreshold: { global: { branches: 0, functions: 0, lines: 0, statements: 0 } },
      coveragePathIgnorePatterns: coveragePathIgnore,
    },
  };
};

export default normalizeConfig;
