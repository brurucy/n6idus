import { SortedArraySet } from "../sorted_array.js";

const leq = (a, b) => {
  let isItLeq = true;
  if (!(a === undefined || b === undefined)) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] <= b[i] && b[i] <= a[i]) {
        continue;
      } else {
        isItLeq = a[i] <= b[i];
        return isItLeq;
      }
    }
  }
  return isItLeq;
};

test("add to sorted array set, simple", () => {
  let sortedArraySet = new SortedArraySet(leq);

  sortedArraySet.add([1, 2, 3]);
  sortedArraySet.add([1, 2, 2]);

  expect(sortedArraySet.bucket).toEqual([
    [1, 2, 2],
    [1, 2, 3],
  ]);
});

test("add to sorted array set, less simple", () => {
  let sortedArraySet = new SortedArraySet(leq);

  sortedArraySet.add([1, 2, 3]);
  sortedArraySet.add([1, 2, 2]);
  sortedArraySet.add([1, 6, 7]);
  sortedArraySet.add([1, 3, 5]);
  sortedArraySet.add([1, 2, 4]);
  sortedArraySet.add([1, 9, 9]);

  expect(sortedArraySet.bucket).toEqual([
    [1, 2, 2],
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 5],
    [1, 6, 7],
    [1, 9, 9],
  ]);
});

test("Delete from sorted array set", () => {
  let sortedArraySet = new SortedArraySet(leq);

  sortedArraySet.add([1, 2, 3]);
  sortedArraySet.add([1, 2, 2]);
  sortedArraySet.add([1, 6, 7]);
  sortedArraySet.add([1, 3, 5]);
  sortedArraySet.add([1, 2, 4]);
  sortedArraySet.add([1, 9, 9]);

  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.has([1, 2, 3])).toEqual(true);
  sortedArraySet.delete([1, 2, 3]);
  expect(sortedArraySet.has([1, 2, 3])).toEqual(false);

  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.has([1, 6, 7])).toEqual(true);
  sortedArraySet.delete([1, 6, 7]);
  expect(sortedArraySet.has([1, 6, 7])).toEqual(false);

  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.has([1, 2, 2])).toEqual(true);
  sortedArraySet.delete([1, 2, 2]);
  expect(sortedArraySet.has([1, 2, 2])).toEqual(false);

  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.has([1, 2, 4])).toEqual(true);
  sortedArraySet.delete([1, 2, 4]);
  expect(sortedArraySet.has([1, 2, 4])).toEqual(false);

  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.has([1, 3, 5])).toEqual(true);
  sortedArraySet.delete([1, 3, 5]);
  expect(sortedArraySet.has([1, 3, 5])).toEqual(false);

  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.has([1, 9, 9])).toEqual(true);
  sortedArraySet.delete([1, 9, 9]);
  expect(sortedArraySet.has([1, 9, 9])).toEqual(false);

  expect(sortedArraySet.max).toEqual(undefined);
  expect(sortedArraySet.bucket).toEqual([]);
});

test("Remove nth from sorted array set", () => {
  let sortedArraySet = new SortedArraySet(leq);

  sortedArraySet.add([1, 2, 3]);
  sortedArraySet.add([1, 2, 2]);
  sortedArraySet.add([1, 6, 7]);
  sortedArraySet.add([1, 3, 5]);
  sortedArraySet.add([1, 2, 4]);
  sortedArraySet.add([1, 9, 9]);

  sortedArraySet.remove(0);
  expect(sortedArraySet.max).toEqual([1, 9, 9]);
  expect(sortedArraySet.select(0)).toEqual([1, 2, 3]);
  sortedArraySet.remove(4);
  expect(sortedArraySet.max).toEqual([1, 6, 7]);
  expect(sortedArraySet.select(3)).toEqual([1, 6, 7]);
  sortedArraySet.remove(3);
  expect(sortedArraySet.max).toEqual([1, 3, 5]);
  expect(sortedArraySet.select(2)).toEqual([1, 3, 5]);
  sortedArraySet.remove(2);
  expect(sortedArraySet.max).toEqual([1, 2, 4]);
  expect(sortedArraySet.select(1)).toEqual([1, 2, 4]);
  sortedArraySet.remove(1);
  expect(sortedArraySet.select(0)).toEqual([1, 2, 3]);
  sortedArraySet.remove(0);
  expect(sortedArraySet.select(0)).toEqual(null);
  expect(sortedArraySet.max).toEqual(undefined);
  expect(sortedArraySet.bucket).toEqual([]);
});

test("Remove non existing", () => {
  const sas = new SortedArraySet(leq);
  expect(sas.remove(1)).toEqual(null);
});
