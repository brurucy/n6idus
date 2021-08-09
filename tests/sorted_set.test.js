import { IndexedSortedSet } from '../src/mod';

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

test('add to sorted set, simple', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);

	expect(ISortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
	expect(ISortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
});

test('add to sorted set, with balance', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);
	ISortedSet.add([1, 6, 7]);
	ISortedSet.add([1, 3, 5]);
	ISortedSet.add([1, 2, 4]);
	ISortedSet.add([1, 9, 9]);

	expect(ISortedSet.buckets[0].bucket[0]).toEqual([1, 2, 2]);
	expect(ISortedSet.buckets[0].bucket[1]).toEqual([1, 2, 3]);
	expect(ISortedSet.buckets[1].bucket[0]).toEqual([1, 2, 4]);
	expect(ISortedSet.buckets[1].bucket[1]).toEqual([1, 3, 5]);
	expect(ISortedSet.buckets[2].bucket[0]).toEqual([1, 6, 7]);
	expect(ISortedSet.buckets[2].bucket[1]).toEqual([1, 9, 9]);
});

test('add to sorted set, order and length assurance', () => {
	const ISortedSet = new IndexedSortedSet((x, y) => {
		return x <= y;
	}, 10);
	let dataArr = new Array(1000);
	for (let i = 0; i < dataArr.length; i++) {
		dataArr[i] = i;
	}
	dataArr = shuffle(dataArr);

	for (const item of dataArr) {
		ISortedSet.add(item);
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

test('getting the i-th element', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);
	ISortedSet.add([1, 6, 7]);
	ISortedSet.add([1, 3, 5]);
	ISortedSet.add([1, 2, 4]);
	ISortedSet.add([1, 9, 9]);

	expect(ISortedSet.select(0)).toEqual([1, 2, 2]);
	expect(ISortedSet.select(1)).toEqual([1, 2, 3]);
	expect(ISortedSet.select(2)).toEqual([1, 2, 4]);
	expect(ISortedSet.select(3)).toEqual([1, 3, 5]);
	expect(ISortedSet.select(4)).toEqual([1, 6, 7]);
	expect(ISortedSet.select(5)).toEqual([1, 9, 9]);
});

test('has', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);
	ISortedSet.add([1, 6, 7]);
	ISortedSet.add([1, 3, 5]);
	ISortedSet.add([1, 2, 4]);
	ISortedSet.add([1, 9, 9]);

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

test('Delete from sorted set', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);
	ISortedSet.add([1, 6, 7]);
	ISortedSet.add([1, 3, 5]);
	ISortedSet.add([1, 2, 4]);
	ISortedSet.add([1, 9, 9]);

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

test('Get nth from sorted set', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);
	ISortedSet.add([1, 6, 7]);
	ISortedSet.add([1, 3, 5]);
	ISortedSet.add([1, 2, 4]);
	ISortedSet.add([1, 9, 9]);

	expect(ISortedSet.select(0)).toEqual([1, 2, 2]);
	expect(ISortedSet.select(1)).toEqual([1, 2, 3]);
	expect(ISortedSet.select(2)).toEqual([1, 2, 4]);
	expect(ISortedSet.select(3)).toEqual([1, 3, 5]);
	expect(ISortedSet.select(4)).toEqual([1, 6, 7]);
	expect(ISortedSet.select(5)).toEqual([1, 9, 9]);
});

test('Delete nth from sorted set', () => {
	let ISortedSet = new IndexedSortedSet(leq, 3);

	ISortedSet.add([1, 2, 3]);
	ISortedSet.add([1, 2, 2]);
	ISortedSet.add([1, 6, 7]);
	ISortedSet.add([1, 3, 5]);
	ISortedSet.add([1, 2, 4]);
	ISortedSet.add([1, 9, 9]);

	ISortedSet.remove(0);
	expect(ISortedSet.select(0)).toEqual([1, 2, 3]);
	ISortedSet.remove(4);
	expect(ISortedSet.select(3)).toEqual([1, 6, 7]);
	ISortedSet.remove(3);
	expect(ISortedSet.select(2)).toEqual([1, 3, 5]);
	ISortedSet.remove(2);
	expect(ISortedSet.select(1)).toEqual([1, 2, 4]);
	ISortedSet.remove(1);
	expect(ISortedSet.select(0)).toEqual([1, 2, 3]);
	ISortedSet.remove(0);
	expect(ISortedSet.select(0)).toEqual(null);
	expect(ISortedSet.buckets[0].bucket).toEqual([]);
});

test('Union', () => {
	const iSortedSetA = new IndexedSortedSet(leq, 3);
	const iSortedSetB = new IndexedSortedSet(leq, 3);

	iSortedSetA.add([1, 2, 3]);
	iSortedSetA.add([1, 2, 2]);
	iSortedSetA.add([1, 6, 7]);
	iSortedSetA.add([1, 3, 5]);
	iSortedSetA.add([1, 2, 4]);
	iSortedSetA.add([1, 9, 9]);

	iSortedSetB.add([1, 2, 6]);
	iSortedSetB.add([1, 3, 9]);

	const ISortedSetC = iSortedSetA.union(iSortedSetB);

	expect(ISortedSetC.length).toEqual(8);
});
