import { SortedSet } from '../src/mod';

const leq = (a, b) => {
  let isItLeq = true;
  if (!(a === undefined || b === undefined)) {
    for (let i = 0; i < a.length; i++) {
      if ((a[i] <= b[i]) && (b[i] <= a[i])) {
        continue;
      } else {
        isItLeq = a[i] <= b[i];
        return isItLeq;
      }
    }
  }
  return isItLeq;
};

test('add to sorted set, simple', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);

  expect(sortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
  expect(sortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
});

test('add to sorted set, with balance', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
  expect(sortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
  expect(sortedSet.buckets[1].bucket[0]).toEqual([1, 2, 4]);
  expect(sortedSet.buckets[1].bucket[1]).toEqual([1, 3, 5]);
  expect(sortedSet.buckets[2].bucket[0]).toEqual([1, 6, 7]);
  expect(sortedSet.buckets[2].bucket[1]).toEqual([1, 9, 9]);
});


test('add to sorted set, index validation', () => {
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
});

test('add to sorted set, order and length assurance', () => {
  const sortedSet = new SortedSet((x, y) => { return x <= y; }, 10);
  let dataArr = new Array(1000);
  for (let i = 0; i < dataArr.length; i++) {
    dataArr[i] = i;
  }
  dataArr = getShuffledArr(dataArr);

  for (const item of dataArr) {
    sortedSet.add(item);
  }

  expect(sortedSet.length).toEqual(1000);

  let curr;
  let last;
  for (let i = 0; i < sortedSet.buckets.length; i++) {
    last = sortedSet.buckets[i].bucket[0];
    for (let j = 1; j < sortedSet.buckets[i].bucket.length; j++) {
      curr = sortedSet.buckets[i].bucket[j];
      expect(curr > last).toEqual(true);
      last = curr;
    }
  }
});

test('getting the i-th element', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.select(0)).toEqual([1, 2, 2]);
  expect(sortedSet.select(1)).toEqual([1, 2, 3]);
  expect(sortedSet.select(2)).toEqual([1, 2, 4]);
  expect(sortedSet.select(3)).toEqual([1, 3, 5]);
  expect(sortedSet.select(4)).toEqual([1, 6, 7]);
  expect(sortedSet.select(5)).toEqual([1, 9, 9]);

});

test('has', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.has([1, 2, 2])).toEqual(true);
  expect(sortedSet.has([1, 2, 3])).toEqual(true);
  expect(sortedSet.has([1, 2, 4])).toEqual(true);
  expect(sortedSet.has([1, 3, 5])).toEqual(true);
  expect(sortedSet.has([1, 6, 7])).toEqual(true);
  expect(sortedSet.has([1, 9, 9])).toEqual(true);

  expect(sortedSet.has([1, 2, 9])).toEqual(false);
  expect(sortedSet.has([1, 15, 1])).toEqual(false);
  expect(sortedSet.has([1, 1, 1])).toEqual(false);

});

test('Delete from sorted set', () => {
  let sortedSet = new SortedSet(leq, 3);

  sortedSet.add([1, 2, 3]);
  sortedSet.add([1, 2, 2]);
  sortedSet.add([1, 6, 7]);
  sortedSet.add([1, 3, 5]);
  sortedSet.add([1, 2, 4]);
  sortedSet.add([1, 9, 9]);

  expect(sortedSet.index).toEqual([2, 4, 6]);
  expect(sortedSet.has([1, 2, 3])).toEqual(true);
  sortedSet.delete([1, 2, 3]);
  expect(sortedSet.has([1, 2, 3])).toEqual(false);

  expect(sortedSet.index).toEqual([1, 3, 5]);
  expect(sortedSet.has([1, 6, 7])).toEqual(true);
  sortedSet.delete([1, 6, 7]);
  expect(sortedSet.has([1, 6, 7])).toEqual(false);

  expect(sortedSet.index).toEqual([1, 3, 4]);
  expect(sortedSet.has([1, 2, 2])).toEqual(true);
  sortedSet.delete([1, 2, 2]);
  expect(sortedSet.has([1, 2, 2])).toEqual(false);

  expect(sortedSet.index).toEqual([2, 3]);
  expect(sortedSet.has([1, 2, 4])).toEqual(true);
  sortedSet.delete([1, 2, 4]);
  expect(sortedSet.has([1, 2, 4])).toEqual(false);

  expect(sortedSet.index).toEqual([1, 2]);
  expect(sortedSet.has([1, 3, 5])).toEqual(true);
  sortedSet.delete([1, 3, 5]);
  expect(sortedSet.has([1, 3, 5])).toEqual(false);

  expect(sortedSet.index).toEqual([1]);
  expect(sortedSet.has([1, 9, 9])).toEqual(true);
  sortedSet.delete([1, 9, 9]);
  expect(sortedSet.has([1, 9, 9])).toEqual(false);

  expect(sortedSet.index).toEqual([]);
  expect(sortedSet.buckets[0].bucket).toEqual([]);

});

/*

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
*/
