/* eslint-disable import/prefer-default-export */
export const chunk = <T>(arr: T[], chunkSize: number) => {
  const chunkedArray: T[][] = [];
  let index = 0;

  while (index < arr.length) {
    chunkedArray.push(arr.slice(index, index + chunkSize));
    index += chunkSize;
  }

  return chunkedArray;
};
