import normalizeConfig, {
  getRoots,
  getThresholdLimits,
  getRootDirectory,
  getCoverageDirectory,
  getCoveragePathIgnorePatterns,
} from './normalize';

describe('getCoverageDirectory()', () => {
  test('it should work with coverageDirectory', () => {
    const results = getCoverageDirectory({ coverageDirectory: '/path/to/coverage' });

    expect(results).toEqual('/path/to/coverage');
  });

  test('it should work without coverageDirectory', () => {
    const results = getCoverageDirectory({});

    expect(results).toEqual('.coverage');
  });
});

describe('getCoveragePathIgnorePatterns()', () => {
  test('it should work with coveragePathIgnorePatterns', () => {
    const results = getCoveragePathIgnorePatterns({ coveragePathIgnorePatterns: ['__mock__'] });

    expect(results).toEqual(['__mock__']);
  });

  test('it should work without coveragePathIgnorePatterns', () => {
    const results = getCoveragePathIgnorePatterns({});

    expect(results).toEqual([]);
  });
});

describe('getRootDirectory()', () => {
  test('it should work with rootDir', () => {
    const results = getRootDirectory({ rootDir: '/path/to/project' }, '/path/to/root');

    expect(results).toEqual('/path/to/project');
  });

  test('it should work without rootDir', () => {
    const results = getRootDirectory({}, '/path/to/root');

    expect(results).toEqual('/path/to/root');
  });
});

describe('getRoots()', () => {
  test('it should work with roots', () => {
    const results = getRoots({ roots: ['src', '<rootDir>/pages'] }, '/path/to/root');

    expect(results).toEqual(['src', '/path/to/root/pages']);
  });

  test('it should work without roots', () => {
    const results = getRoots({}, '/path/to/root');

    expect(results).toEqual(['/path/to/root']);
  });
});

describe('getThresholdLimits()', () => {
  test('it should work with coverageThreshold', () => {
    const results = getThresholdLimits({
      coverageThreshold: { global: { functions: '90', lines: 90, branches: 90, statements: 90 } },
    });

    expect(results).toEqual({
      branches: 90,
      lines: 90,
      statements: 90,
    });
  });

  test('it should work without coverageThreshold', () => {
    const results = getThresholdLimits({});

    expect(results).toEqual({});
  });
});

describe('normalizeConfig()', () => {
  test('it should work', () => {
    const config = {
      testMatch: ['**/*.test.{js,jsx,ts,tsx}'],
      collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
    };

    const results = normalizeConfig(config, '/path/to/project');

    expect(results).toEqual({
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
      coverageDirectory: '.coverage',
      coveragePathIgnorePatterns: [],
      coverageReporters: ['json-summary'],
      coverageThreshold: {
        global: { branches: 0, functions: 0, lines: 0, statements: 0 },
      },
      rootDir: '/path/to/project',
      roots: ['/path/to/project'],
      testMatch: ['**/*.test.{js,jsx,ts,tsx}'],
      thresholdLimits: {},
    });
  });

  test('it should throw an error by testMatch', () => {
    const config = {};

    const callback = () => normalizeConfig(config, '/path/to/project');

    expect(callback).toThrow('The jest config parameter "testMatch" is missing');
  });

  test('it should throw an error by collectCoverageFrom', () => {
    const config = { testMatch: ['**/*.test.{js,jsx,ts,tsx}'] };

    const callback = () => normalizeConfig(config, '/path/to/project');

    expect(callback).toThrow('The jest config parameter "collectCoverageFrom" is missing');
  });
});
