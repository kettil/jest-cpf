import { CoverageSummaryType } from '../types';

export const isObject = (data: unknown): data is Record<string, unknown> => typeof data === 'object' && data !== null;

export const isSummary = (data: unknown): data is CoverageSummaryType =>
  isObject(data) && typeof data.pct === 'number' && typeof data.total === 'number' && typeof data.covered === 'number';

export const isGlobalThreshold = (threshold: unknown): threshold is { global: Record<string, unknown> } =>
  isObject(threshold) && isObject(threshold.global);
