import { binarySearch, binaryInsertAt, SortedSet } from '../src/mod';

const leq = (a, b) => {
  let isItLeq = true;
  if (!(a === undefined || b === undefined)) {
    for (let i = 0; i < a.length; i++) {
      if ((a[i] <= b[i]) & (b[i] <= a[i])) {
        continue;
      } else {
        isItLeq = a[i] <= b[i];
        return isItLeq;
      }
    }
  }
  return isItLeq;
};

const tripleArrEq = (A, B) => {
  let isItEq = true;
  if (A.length !== B.length) {
    isItEq = false;
    return isItEq;
  } else {
    for (let i = 0; i < A.length; i++) {
      if (leq(A[i], B[i]) & leq(B[i], A[i])) {
        continue;
      } else {
        isItEq = false;
        return isItEq;
      }
    }
  }
  return isItEq;
};

// Here we check for key equalities
const keyLeq = (a, b) => {
  let isItLeq = true;
  if (!Array.isArray(a['0'])) {
    isItLeq = a['0'] <= b['0'];
  } else {
    for (let i = 0; i < a['0'].length; i++) {
      if ((a['0'][i] <= b['0'][i]) & (b['0'][i] <= a['0'][i])) {
        continue;
      } else {
        isItLeq = a['0'][i] <= b['0'][i];
        return isItLeq;
      }
    }
  }
  return isItLeq;
};

test('Bisect [[1, 3, 5], [2, 1, 3], [3, 6, 7]] [1, 7, 5]', () => {
  const tripleArr = [
    [1, 3, 5],
    [2, 1, 3],
    [3, 6, 7],
  ];

  const bisection = binaryInsertAt(tripleArr, leq, [1, 7, 5]);

  expect(bisection).toEqual(1);
});

test('Bisect [[1, 3, 5], [2, 1, 3], [3, 6, 7]] [2, 1, 3]', () => {
  const tripleArr = [
    [1, 3, 5],
    [2, 1, 3],
    [3, 6, 7],
  ];

  const bisection = binarySearch(tripleArr, leq, [2, 1, 3]);

  expect(bisection).toEqual(true);
});

test('Bisect [[1, 3, 5], [2, 1, 4], [3, 6, 7]] [2, 1, 3]', () => {
  const tripleArr = [
    [1, 3, 5],
    [2, 1, 4],
    [3, 6, 7],
  ];

  const bisection = binarySearch(tripleArr, leq, [2, 1, 3]);

  expect(bisection).toEqual(false);
});

test('add to sorted set, simple', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);

  expect(sortedSet.buckets).toEqual([
    [
      [1, 2, 2],
      [1, 2, 3],
    ],
  ]);
});

test('add to sorted set, with balance', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.buckets).toEqual([
    [
      [1, 2, 2],
      [1, 2, 3],
    ],
    [
      [1, 2, 4],
      [1, 3, 5],
    ],
    [
      [1, 6, 7],
      [1, 9, 9],
    ],
  ]);
});

test('add to sorted set, index validation', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.index).toEqual([2, 4, 6]);
});

test('Remove from sorted set', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  sortedSet.delete([1, 2, 3]);
  sortedSet.delete([1, 2, 2]);
  sortedSet.delete([1, 6, 7]);
  sortedSet.delete([1, 3, 5]);
  sortedSet.delete([1, 2, 4]);
  sortedSet.delete([1, 9, 9]);

  expect(sortedSet.buckets).toEqual([[]]);
});

test('Remove from sorted set, index validation', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  expect(sortedSet.index).toEqual([1]);

  sortedSet.add([1, 2, 2]);
  expect(sortedSet.index).toEqual([2]);

  sortedSet.add([1, 6, 7]);
  expect(sortedSet.index).toEqual([3]);

  sortedSet.add([1, 3, 5]);
  expect(sortedSet.index).toEqual([2, 4]);

  sortedSet.add([1, 2, 4]);
  expect(sortedSet.index).toEqual([2, 5]);

  sortedSet.add([1, 9, 9]);
  expect(sortedSet.index).toEqual([2, 4, 6]);

  sortedSet.delete([1, 2, 3]);
  expect(sortedSet.index).toEqual([1, 3, 5]);

  sortedSet.delete([1, 2, 2]);
  expect(sortedSet.index).toEqual([2, 4]);

  sortedSet.delete([1, 6, 7]);
  expect(sortedSet.index).toEqual([2, 3]);

  sortedSet.delete([1, 3, 5]);
  expect(sortedSet.index).toEqual([1, 2]);

  sortedSet.delete([1, 2, 4]);
  expect(sortedSet.index).toEqual([1]);

  sortedSet.delete([1, 9, 9]);
  expect(sortedSet.index).toEqual([]);
});

test('Get nth from sorted set', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.get(0)).toEqual([1, 2, 2]);
  expect(sortedSet.get(1)).toEqual([1, 2, 3]);
  expect(sortedSet.get(2)).toEqual([1, 2, 4]);
  expect(sortedSet.get(3)).toEqual([1, 3, 5]);
  expect(sortedSet.get(4)).toEqual([1, 6, 7]);
  expect(sortedSet.get(5)).toEqual([1, 9, 9]);
});

test('Delete nth from sorted set', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  sortedSet.remove(0);
  expect(sortedSet.get(0)).toEqual([1, 2, 3]);
  sortedSet.remove(4);
  expect(sortedSet.get(3)).toEqual([1, 6, 7]);
  sortedSet.remove(3);
  expect(sortedSet.get(2)).toEqual([1, 3, 5]);
  sortedSet.remove(2);
  expect(sortedSet.get(1)).toEqual([1, 2, 4]);
  sortedSet.remove(1);
  expect(sortedSet.get(0)).toEqual([1, 2, 3]);
  sortedSet.remove(0);
  expect(sortedSet.get(0)).toEqual(undefined);
  expect(sortedSet.buckets).toEqual([[]]);
  expect(sortedSet.index).toEqual([]);
});
