export function median(arr: number[]) {
  arr = arr.slice();
  if (arr.length === 0) {
    return undefined;
  }
  arr.sort();
  if (arr.length % 2 === 0) {
    return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
  } else {
    return arr[(arr.length - 1) / 2];
  }
}
