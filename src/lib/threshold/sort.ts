import { dirname, basename } from 'path';
import { ThresholdGroupType } from '../types';

const sort = (a: ThresholdGroupType, b: ThresholdGroupType) => {
  const pathA = dirname(a.file);
  const pathB = dirname(b.file);
  const fileA = basename(a.file);
  const fileB = basename(b.file);

  if (pathA === pathB) {
    if (fileA === fileB) {
      return 0;
    }

    return fileA > fileB ? 1 : -1;
  }

  return pathA > pathB ? 1 : -1;
};

export default sort;
