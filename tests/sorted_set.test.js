import { IndexedOrderedSet } from "../n6idus";

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
  let ISortedSet = new IndexedOrderedSet(leq, 3);

  ISortedSet.push([1, 2, 3]);
  ISortedSet.push([1, 2, 2]);

  expect(ISortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
  expect(ISortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
});

test("push to sorted set, with balance", () => {
  let ISortedSet = new IndexedOrderedSet(leq, 3);

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
  const ISortedSet = new IndexedOrderedSet((x, y) => {
    return x <= y;
  }, 10);
  let dataArr = new Array(100000);
  for (let i = 0; i < dataArr.length; i++) {
    dataArr[i] = i;
  }
  dataArr = shuffle(dataArr);

  for (const item of dataArr) {
    ISortedSet.push(item);
  }

  expect(ISortedSet.length).toEqual(100000);

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
  let ISortedSet = new IndexedOrderedSet(leq, 3);

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
  let ISortedSet = new IndexedOrderedSet(leq, 3);

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
  let ISortedSet = new IndexedOrderedSet(leq, 3);

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
  let ISortedSet = new IndexedOrderedSet(leq, 3);

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
  let ISortedSet = new IndexedOrderedSet(leq, 3);

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
  let iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 9, 9]);

  let iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);
  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  const iSortedSetB = new IndexedOrderedSet(leq, 3);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 2, 3]);

  const iSortedSetC = iSortedSetA.sliceByIndex(1, 4);

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("slice by value case 0", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  const iSortedSetB = new IndexedOrderedSet(leq, 3);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 2, 3]);

  const iSortedSetC = iSortedSetA.sliceByValue([1, 2, 3], [1, 2, 4]);

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("slice by value case 1", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);

  const iSortedSetB = new IndexedOrderedSet(leq, 3);
  iSortedSetB.push([1, 6, 7]);
  iSortedSetB.push([1, 3, 5]);
  iSortedSetB.push([1, 2, 4]);
  iSortedSetB.push([1, 2, 3]);

  const iSortedSetC = iSortedSetA.sliceByValue([1, 2, 3], [1, 6, 7]);

  expect(iSortedSetC.sameAs(iSortedSetB)).toEqual(true);
});

test("slice by value case 2", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedOrderedSet(leq, 3);

  iSortedSetC.push([1, 6, 7]);
  iSortedSetC.push([1, 3, 5]);
  iSortedSetC.push([1, 6, 9]);
  iSortedSetC.push([1, 1, 2]);
  iSortedSetC.push([1, 9, 9]);

  iSortedSetA.spliceByIndex(1, 3);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by index case 1", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedOrderedSet(leq, 3);

  iSortedSetA.spliceByIndex(0, 7);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by value case 0", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedOrderedSet(leq, 3);

  iSortedSetC.push([1, 6, 7]);
  iSortedSetC.push([1, 3, 5]);
  iSortedSetC.push([1, 6, 9]);
  iSortedSetC.push([1, 1, 2]);
  iSortedSetC.push([1, 9, 9]);

  iSortedSetA.spliceByValue([1, 2, 2], [1, 2, 4]);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("range delete by value case 1", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 6, 7]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 2, 4]);
  iSortedSetA.push([1, 6, 9]);
  iSortedSetA.push([1, 1, 2]);
  iSortedSetA.push([1, 9, 9]);

  const iSortedSetC = new IndexedOrderedSet(leq, 3);

  iSortedSetA.spliceByValue([1, 1, 2], [1, 9, 9]);

  expect(iSortedSetC.sameAs(iSortedSetA)).toEqual(true);
});

test("map and mapToArray", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  const iSortedSetB = iSortedSetA.map(([_, [s, p, o]]) => [p, s, o]);
  const sortedArray = iSortedSetA.mapToArray(([_, [s, p, o]]) => [p, s, o]);

  const iSortedSetC = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet((x, y) => {
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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  const iSortedSetB = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  expect(iSortedSetA.sameAs(new IndexedOrderedSet(leq, 3))).toEqual(true);
});

test("Get max, and pop", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

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
  expect(iSortedSetA.sameAs(new IndexedOrderedSet(leq, 3))).toEqual(true);
});

test("Next higher key", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.nextHigherKey([1, 6, 7])).toEqual(null);
  expect(iSortedSetA.nextHigherKey([1, 3, 5])).toEqual([1, 6, 7]);
  expect(iSortedSetA.nextHigherKey([1, 2, 3])).toEqual([1, 3, 5]);
  expect(iSortedSetA.nextHigherKey([1, 2, 2])).toEqual([1, 2, 3]);
});

test("Next lower key", () => {
  const iSortedSetA = new IndexedOrderedSet(leq, 3);

  iSortedSetA.push([1, 2, 2]);
  iSortedSetA.push([1, 2, 3]);
  iSortedSetA.push([1, 3, 5]);
  iSortedSetA.push([1, 6, 7]);

  expect(iSortedSetA.nextLowerKey([1, 6, 7])).toEqual([1, 3, 5]);
  expect(iSortedSetA.nextLowerKey([1, 3, 5])).toEqual([1, 2, 3]);
  expect(iSortedSetA.nextLowerKey([1, 2, 3])).toEqual([1, 2, 2]);
  expect(iSortedSetA.nextLowerKey([1, 2, 2])).toEqual(null);
});

test("Splice coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  ios.push(6);
  ios.push(7);
  ios.push(8);
  ios.push(9);
  ios.push(10);
  ios.spliceByValue(3, 7);
  const ios2 = new IndexedOrderedSet();
  ios2.push(1);
  ios2.push(2);
  ios2.push(8);
  ios2.push(9);
  ios2.push(10);
  expect(ios.sameAs(ios2)).toEqual(true);
});

test("Line 200 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  expect(
    ios.every(([position, value]) => {
      return value % 2 === 0;
    })
  ).toEqual(false);
});
test("Line 215-218 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(3);
  expect(
    ios.some(([position, value]) => {
      return value % 2 === 0;
    })
  ).toEqual(false);
});
test("Line 254-258 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  let length = 0;
  ios.forEach(([,]) => {
    length += 1;
  });
  expect(length).toEqual(2);
});
test("Line 373 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  const ios2 = new IndexedOrderedSet();
  ios2.push(2);
  ios2.push(3);
  expect(ios.sliceByIndex(1, 2).sameAs(ios2)).toEqual(true);
});
test("Line 388-392 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  ios.push(6);
  ios.push(7);
  ios.push(8);

  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  expect(ios.sliceByIndex(1, 7).sameAs(ios2)).toEqual(true);
});
test("Line 415 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  const ios2 = new IndexedOrderedSet();
  ios2.push(2);
  ios2.push(3);
  expect(ios.sliceByValue(2, 3).sameAs(ios2)).toEqual(true);
});
test("Line 452-457 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  ios.push(6);
  ios.push(7);
  ios.push(8);

  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);

  ios.spliceByIndex(1, 7);

  expect(ios.sameAs(ios2)).toEqual(true);
});
test("Line 552 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  expect(ios.push(2)).toEqual(null);
});
test("Line 582 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  expect(ios.delete(3)).toEqual(null);
});
test("Line 603 coverage", () => {
  const ios = new IndexedOrderedSet();
  ios.push(1);
  ios.push(2);
  expect(ios.deleteByIndex(2)).toEqual(null);
});
test("Line 645-646 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(6);
  ios2.push(9);
  ios2.push(151);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(1);
  ios3.push(2);
  ios3.push(3);
  ios3.push(6);
  ios3.push(9);
  ios3.push(151);
  expect(ios.union(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 680-685 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  expect(ios.union(ios2).sameAs(ios)).toEqual(true);
});
test("Line 739-741 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(1);
  ios3.push(2);
  ios3.push(3);
  expect(ios.intersection(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 808-810 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(1);
  expect(ios.difference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 819 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(1);
  expect(ios.difference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 821-824 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(1);
  ios3.push(4);
  expect(ios.difference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 839-842 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(4);
  ios.push(5);
  ios.push(6);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(4);
  ios3.push(5);
  ios3.push(6);
  expect(ios.difference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 890-892 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(1);
  expect(ios.symmetricDifference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 895-898 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(4);
  expect(ios.symmetricDifference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 900-903 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  const ios3 = new IndexedOrderedSet(undefined, 1);
  ios3.push(4);
  expect(ios.symmetricDifference(ios2).sameAs(ios3)).toEqual(true);
});
test("Line 950-951 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  ios.push(1);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(3);
  expect(ios.sameAs(ios2)).toEqual(false);
});
test("Line 987-988 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  ios2.push(9);
  ios2.push(10);
  expect(ios.isDisjointWith(ios2)).toEqual(true);
});
test("Line 1000-1005 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  expect(ios.isDisjointWith(ios2)).toEqual(false);
});
test("Line 1017 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 1);
  expect(ios.isEmpty()).toEqual(true);
});
test("Line 1065-1070 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  ios2.push(9);
  ios2.push(10);
  expect(ios.isSubsetOf(ios2)).toEqual(false);
});
test("Line 1069-1070 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  const ios2 = new IndexedOrderedSet(undefined, 2);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  ios2.push(9);
  ios2.push(10);
  expect(ios2.isSubsetOf(ios)).toEqual(false);
});
test("Line 1126-1131 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  const ios2 = new IndexedOrderedSet(undefined, 2);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  ios2.push(6);
  expect(ios.isProperSubsetOf(ios2)).toEqual(true);
});
test("Line 1127-1128", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(2);
  ios.push(3);
  ios.push(4);
  ios.push(5);
  ios.push(6);
  ios.push(7);
  ios.push(8);
  const ios2 = new IndexedOrderedSet(undefined, 2);
  ios2.push(1);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  expect(ios.isProperSubsetOf(ios2)).toEqual(false);
});
test("Line 1139 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(6);
  ios.push(7);
  ios.push(8);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  expect(ios.isProperSubsetOf(ios2)).toEqual(true);
});
test("Line 1190-1195 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(6);
  ios.push(7);
  ios.push(8);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  expect(ios2.isSupersetOf(ios)).toEqual(true);
});
test("Line 1194-1195", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(6);
  ios.push(7);
  ios.push(8);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  expect(ios.isSupersetOf(ios2)).toEqual(false);
});
test("Line 1251-1256 coverage", () => {
  const ios = new IndexedOrderedSet(undefined, 2);
  ios.push(1);
  ios.push(6);
  ios.push(7);
  ios.push(8);
  const ios2 = new IndexedOrderedSet(undefined, 1);
  ios2.push(1);
  ios2.push(2);
  ios2.push(3);
  ios2.push(4);
  ios2.push(5);
  ios2.push(6);
  ios2.push(7);
  ios2.push(8);
  expect(ios.isProperSupersetOf(ios2)).toEqual(false);
  expect(ios2.isProperSupersetOf(ios)).toEqual(true);
});
