import { IndexedSortedSet } from "../src/mod";

const leq = (a, b) => {
  let isItLeq = true;
  if (!(a === undefined || b === undefined)) {
    for (let i = 0; i < a.length; i++) {
      if (!(a[i] <= b[i] && b[i] <= a[i])) {
        isItLeq = a[i] <= b[i];
        return isItLeq;
      }
    }
  }
  return isItLeq;
};

const shuffle = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

test("push to sorted set, simple", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);

  expect(ISortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
  expect(ISortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
});

test("push to sorted set, with balance", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);
  ISortedSet.push([1, 6, 7]);
  ISortedSet.push([1, 3, 5]);
  ISortedSet.push([1, 2, 4]);
  ISortedSet.push([1, 9, 9]);

  expect(ISortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
  expect(ISortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
  expect(ISortedSet.buckets[1].bucket[0]).toEqual([1, 2, 4]);
  expect(ISortedSet.buckets[1].bucket[1]).toEqual([1, 3, 5]);
  expect(ISortedSet.buckets[2].bucket[0]).toEqual([1, 6, 7]);
  expect(ISortedSet.buckets[2].bucket[1]).toEqual([1, 9, 9]);
});

test("push to sorted set, order and length assurance", () => {
  const ISortedSet = new IndexedSortedSet((x, y) => {
    return x <= y;
  }, 10);
  let dataArr = new Array(1000);
  for (let i = 0; i < dataArr.length; i++) {
    dataArr[i] = i;
  }
  dataArr = shuffle(dataArr);

  for (const item of dataArr) {
    ISortedSet.push(item);
  }

  expect(ISortedSet.length).toEqual(1000);

  let curr;
  let last;
  for (let i = 0; i < ISortedSet.buckets.length; i++) {
    last = ISortedSet.buckets[i].bucket[0];
    for (let j = 1; j < ISortedSet.buckets[i].bucket.length; j++) {
      curr = ISortedSet.buckets[i].bucket[j];
      expect(curr > last).toEqual(true);
      last = curr;
    }
  }
});

test("getting the i-th element", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);
  ISortedSet.push([1, 6, 7]);
  ISortedSet.push([1, 3, 5]);
  ISortedSet.push([1, 2, 4]);
  ISortedSet.push([1, 9, 9]);

  expect(ISortedSet.select(0)).toEqual([1, 2, 2]);
  expect(ISortedSet.select(1)).toEqual([1, 2, 3]);
  expect(ISortedSet.select(2)).toEqual([1, 2, 4]);
  expect(ISortedSet.select(3)).toEqual([1, 3, 5]);
  expect(ISortedSet.select(4)).toEqual([1, 6, 7]);
  expect(ISortedSet.select(5)).toEqual([1, 9, 9]);
});

test("has", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);
  ISortedSet.push([1, 6, 7]);
  ISortedSet.push([1, 3, 5]);
  ISortedSet.push([1, 2, 4]);
  ISortedSet.push([1, 9, 9]);

  expect(ISortedSet.has([1, 2, 2])).toEqual(true);
  expect(ISortedSet.has([1, 2, 3])).toEqual(true);
  expect(ISortedSet.has([1, 2, 4])).toEqual(true);
  expect(ISortedSet.has([1, 3, 5])).toEqual(true);
  expect(ISortedSet.has([1, 6, 7])).toEqual(true);
  expect(ISortedSet.has([1, 9, 9])).toEqual(true);

  expect(ISortedSet.has([1, 2, 9])).toEqual(false);
  expect(ISortedSet.has([1, 15, 1])).toEqual(false);
  expect(ISortedSet.has([1, 1, 1])).toEqual(false);
});

test("Delete from sorted set", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);
  ISortedSet.push([1, 6, 7]);
  ISortedSet.push([1, 3, 5]);
  ISortedSet.push([1, 2, 4]);
  ISortedSet.push([1, 9, 9]);

  expect(ISortedSet.has([1, 2, 3])).toEqual(true);
  ISortedSet.delete([1, 2, 3]);
  expect(ISortedSet.has([1, 2, 3])).toEqual(false);

  expect(ISortedSet.has([1, 6, 7])).toEqual(true);
  ISortedSet.delete([1, 6, 7]);
  expect(ISortedSet.has([1, 6, 7])).toEqual(false);

  expect(ISortedSet.has([1, 2, 2])).toEqual(true);
  ISortedSet.delete([1, 2, 2]);
  expect(ISortedSet.has([1, 2, 2])).toEqual(false);

  expect(ISortedSet.has([1, 2, 4])).toEqual(true);
  ISortedSet.delete([1, 2, 4]);
  expect(ISortedSet.has([1, 2, 4])).toEqual(false);

  expect(ISortedSet.has([1, 3, 5])).toEqual(true);
  ISortedSet.delete([1, 3, 5]);
  expect(ISortedSet.has([1, 3, 5])).toEqual(false);

  expect(ISortedSet.has([1, 9, 9])).toEqual(true);
  ISortedSet.delete([1, 9, 9]);
  expect(ISortedSet.has([1, 9, 9])).toEqual(false);

  expect(ISortedSet.index.innerStructure).toEqual([0]);
  expect(ISortedSet.buckets[0].bucket).toEqual([]);
});

test("Get nth from sorted set", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);
  ISortedSet.push([1, 6, 7]);
  ISortedSet.push([1, 3, 5]);
  ISortedSet.push([1, 2, 4]);
  ISortedSet.push([1, 9, 9]);

  expect(ISortedSet.select(0)).toEqual([1, 2, 2]);
  expect(ISortedSet.select(1)).toEqual([1, 2, 3]);
  expect(ISortedSet.select(2)).toEqual([1, 2, 4]);
  expect(ISortedSet.select(3)).toEqual([1, 3, 5]);
  expect(ISortedSet.select(4)).toEqual([1, 6, 7]);
  expect(ISortedSet.select(5)).toEqual([1, 9, 9]);
});

test("Delete nth from sorted set", () => {
  let ISortedSet = new IndexedSortedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);
  ISortedSet.push([1, 6, 7]);
  ISortedSet.push([1, 3, 5]);
  ISortedSet.push([1, 2, 4]);
  ISortedSet.push([1, 9, 9]);

  ISortedSet.deleteByIndex(0);
  expect(ISortedSet.select(0)).toEqual([1, 2, 3]);
  ISortedSet.deleteByIndex(4);
  expect(ISortedSet.select(3)).toEqual([1, 6, 7]);
  ISortedSet.deleteByIndex(3);
  expect(ISortedSet.select(2)).toEqual([1, 3, 5]);
  ISortedSet.deleteByIndex(2);
  expect(ISortedSet.select(1)).toEqual([1, 2, 4]);
  ISortedSet.deleteByIndex(1);
  expect(ISortedSet.select(0)).toEqual([1, 2, 3]);
  ISortedSet.deleteByIndex(0);
  expect(ISortedSet.select(0)).toEqual(null);
  expect(ISortedSet.buckets[0].bucket).toEqual([]);
});

test("SameAs", () => {
  let iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 9, 9]);

  let iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 9, 9]);

  expect(iSortedSetA.sameAs(iSortedSetB)).toEqual(true);

  iSortedSetA.push([1, 1, 1]);

  expect(iSortedSetA.sameAs(iSortedSetB)).toEqual(false);
});

test("Union", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 9, 9]);

  iSortedSetB.push([1, 2, 6]);
  iSortedSetB.push([1, 3, 9]);

  const ISortedSetC = iSortedSetA.union(iSortedSetB);

  expect(ISortedSetC.length).toEqual(8);
});

test("Intersection", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 9, 9]);

  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 1]);
  iSortedSetB.push([1, 2, 0]);
  iSortedSetB.push([1, 2, 6]);
  iSortedSetB.push([1, 2, 7]);
  iSortedSetB.push([1, 2, 8]);
  iSortedSetB.push([1, 2, 9]);
  iSortedSetB.push([1, 2, 16]);
  iSortedSetB.push([1, 9, 9]);

  const ISortedSetC = iSortedSetA.intersection(iSortedSetB);

  expect(ISortedSetC.length).toEqual(3);
});

test("Difference", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 3, 1]);
  iSortedSetA.push([1, 9, 9]);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 9, 9]);

  const ISortedSetC = iSortedSetA.difference(iSortedSetB);

  expect(ISortedSetC.length).toEqual(1);
});

test("Symmetric Difference", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 3, 1]);
  iSortedSetA.push([1, 9, 9]);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 9, 9]);
  iSortedSetB.push([1, 8, 9]);

  let ISortedSetC = iSortedSetA.symmetricDifference(iSortedSetB);
  expect(ISortedSetC.length).toEqual(2);
});

test("isSupersetOf", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 9, 9]);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);

  expect(iSortedSetA.isSupersetOf(iSortedSetB)).toEqual(true);
});

test("isProperSupersetOf", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);

  expect(iSortedSetA.isProperSupersetOf(iSortedSetB)).toEqual(false);
});

test("isSubsetOf", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 9, 9]);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);

  expect(iSortedSetB.isSubsetOf(iSortedSetB)).toEqual(true);
});

test("isProperSupersetOf", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  iSortedSetB.push([1, 2, 3]);
  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);

  expect(iSortedSetB.isProperSubsetOf(iSortedSetB)).toEqual(false);
});

test("isDisjointWith", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);
  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  iSortedSetB.push([3, 2, 3]);
  iSortedSetB.push([3, 2, 2]);
  iSortedSetB.push([3, 6, 7]);
  iSortedSetB.push([3, 3, 5]);
  iSortedSetB.push([3, 2, 4]);

  expect(iSortedSetB.isDisjointWith(iSortedSetA)).toEqual(true);
});

test("forward iterator", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  let length = 0;
  for (const item of iSortedSetA.makeForwardCursor()) {
    length += 1;
  }

  expect(length).toEqual(iSortedSetA.length);
});

test("backwards iterator", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  let length = 0;
  for (const item of iSortedSetA.makeBackwardsCursor()) {
    length += 1;
  }
  expect(length).toEqual(iSortedSetA.length);
});

test("forward range iterator by index", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  let length = 0;
  for (const item of iSortedSetA.makeForwardCursorByIndex(1, 4)) {
    length += 1;
  }

  expect(length).toEqual(4);
});
test("forward range iterator by value", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  let length = 0;
  for (const item of iSortedSetA.makeForwardCursorByValue(
    [1, 2, 4],
    [1, 6, 7]
  )) {
    length += 1;
  }

  expect(length).toEqual(3);
});
test("backwards range iterator by index", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  let length = 0;
  for (const item of iSortedSetA.makeBackwardsCursorByIndex(4, 1)) {
    length += 1;
  }

  expect(length).toEqual(4);
});
test("backwards range iterator by value", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  let length = 0;
  for (const item of iSortedSetA.makeBackwardsCursorByValue(
    [1, 6, 7],
    [1, 2, 4]
  )) {
    length += 1;
  }

  expect(length).toEqual(3);
});

test("slice by index", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  const iSortedSetB = new IndexedSortedSet(leq, 3);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 2, 3]);

  const iSortedSetC = iSortedSetA.sliceByIndex(1, 4);

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("slice by value case 0", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  const iSortedSetB = new IndexedSortedSet(leq, 3);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 2, 3]);

  const iSortedSetC = iSortedSetA.sliceByValue([1, 2, 3], [1, 2, 4]);

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("slice by value case 1", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  const iSortedSetB = new IndexedSortedSet(leq, 3);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 2, 3]);

  const iSortedSetC = iSortedSetA.sliceByValue([1, 2, 3], [1, 6, 7]);

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("slice by value case 2", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = iSortedSetA.sliceByValue([1, 1, 2], [1, 9, 9]);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by index case 0", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedSortedSet(leq, 3);

  iSortedSetC.push([1, 6, 7]);
  iSortedSetC.push([1, 3, 5]);
  iSortedSetC.push([1, 6, 9]);
  iSortedSetC.push([1, 1, 2]);
  iSortedSetC.push([1, 9, 9]);

  iSortedSetA.spliceByIndex(1, 3);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by index case 1", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedSortedSet(leq, 3);

  iSortedSetA.spliceByIndex(0, 7);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by value case 0", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedSortedSet(leq, 3);

  iSortedSetC.push([1, 6, 7]);
  iSortedSetC.push([1, 3, 5]);
  iSortedSetC.push([1, 6, 9]);
  iSortedSetC.push([1, 1, 2]);
  iSortedSetC.push([1, 9, 9]);

  iSortedSetA.spliceByValue([1, 2, 2], [1, 2, 4]);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by value case 1", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedSortedSet(leq, 3);

  iSortedSetA.spliceByValue([1, 1, 2], [1, 9, 9]);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("map and mapToArray", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  const iSortedSetB = iSortedSetA.map(([_, [s, p, o]]) => [p, s, o]);
  const sortedArray = iSortedSetA.mapToArray(([_, [s, p, o]]) => [p, s, o]);

  const iSortedSetC = new IndexedSortedSet(leq, 3);

  iSortedSetC.push([2, 1, 2]);
  iSortedSetC.push([2, 1, 3]);
  iSortedSetC.push([3, 1, 5]);
  iSortedSetC.push([6, 1, 7]);

  const iSortedSetCArr = iSortedSetC.toArray();

  for (let i = 0; i < sortedArray.length; i++) {
    expect(
      leq(iSortedSetCArr[i], sortedArray[i]) &&
        leq(sortedArray[i], iSortedSetCArr[i])
    ).toEqual(true);
  }

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("reduce and reduceRight", () => {
  const iSortedSetA = new IndexedSortedSet((x, y) => {
    return x <= y;
  }, 3);

  iSortedSetA.push(1);
  iSortedSetA.push(2);
  iSortedSetA.push(3);
  iSortedSetA.push(4);

  const reducer = (acc, [idx, val]) => {
    return acc.toString() + val.toString();
  };
  const leftReduce = iSortedSetA.reduce(reducer, 0);
  const rightReduce = iSortedSetA.reduceRight(reducer, 0);

  expect(leftReduce).toEqual("01234");
  expect(rightReduce).toEqual("04321");
});

test("filter, every and some", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  const iSortedSetB = new IndexedSortedSet(leq, 3);

  iSortedSetB.push([1, 2, 2]);
  iSortedSetB.push([1, 2, 3]);

  expect(
    iSortedSetA.filter(([length, [s, p, o]]) => {
      return p === 2;
    })
  ).toEqual(iSortedSetB);

  expect(
    iSortedSetA.filterToArray(([length, [s, p, o]]) => {
      return p === 2;
    })
  ).toEqual([
    [1, 2, 2],
    [1, 2, 3],
  ]);

  expect(
    iSortedSetA.every(([length, [s, p, o]]) => {
      return s === 1;
    })
  );

  expect(
    iSortedSetA.some(([length, [s, p, o]]) => {
      return p === 2;
    })
  );
});

test("Get min, and shift", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.getMin()).toEqual([1, 2, 2]);

  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 2, 2])).toEqual(false);
  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 2, 3])).toEqual(false);
  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 3, 5])).toEqual(false);
  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 6, 7])).toEqual(false);
});

test("Get min, and shift", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.getMin()).toEqual([1, 2, 2]);

  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 2, 2])).toEqual(false);
  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 2, 3])).toEqual(false);
  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 3, 5])).toEqual(false);
  iSortedSetA.shift();
  expect(iSortedSetA.has([1, 6, 7])).toEqual(false);
  expect(iSortedSetA.sameAs(new IndexedSortedSet(leq, 3))).toEqual(true);
});

test("Get max, and pop", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.getMax()).toEqual([1, 6, 7]);

  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 6, 7])).toEqual(false);
  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 3, 5])).toEqual(false);
  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 2, 3])).toEqual(false);
  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 2, 2])).toEqual(false);
  expect(iSortedSetA.sameAs(new IndexedSortedSet(leq, 3))).toEqual(true);
});

test("Next higher key", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.getMax()).toEqual([1, 6, 7]);

  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 6, 7])).toEqual(false);
  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 3, 5])).toEqual(false);
  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 2, 3])).toEqual(false);
  iSortedSetA.pop();
  expect(iSortedSetA.has([1, 2, 2])).toEqual(false);
  expect(iSortedSetA.sameAs(new IndexedSortedSet(leq, 3))).toEqual(true);
});

test("Next lower key", () => {
  const iSortedSetA = new IndexedSortedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.nextLowerKey([1, 6, 7])).toEqual([1, 3, 5]);
  expect(iSortedSetA.nextLowerKey([1, 3, 5])).toEqual([1, 2, 3]);
  expect(iSortedSetA.nextLowerKey([1, 2, 3])).toEqual([1, 2, 2]);
  expect(iSortedSetA.nextLowerKey([1, 2, 2])).toEqual(null);
});
