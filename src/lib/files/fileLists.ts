import getFileList from './fileList';

const getFileLists = async (
  paths: string[],
  patterns: string[],
  pathCallback: (path: string) => string,
): Promise<string[]> => {
  const promises: Array<Promise<string[]>> = [];

  for (const path of paths) {
    for (const pattern of patterns) {
      promises.push(getFileList(pattern, path, pathCallback(path)));
    }
  }

  const lists = await Promise.all(promises);

  return lists.reduce((p, c) => p.concat(c), []).filter((v, i, a) => a.indexOf(v) === i);
};

export default getFileLists;
