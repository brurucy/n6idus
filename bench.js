import { IndexedSortedSet, SortedSet } from './src/mod.js';
import CollectionsSortedSet from 'collections/sorted-set.js';
import FunctionalRedBlackTree from 'functional-red-black-tree';
import BTree from 'sorted-btree';
let BTreeSet = BTree.default;
import Microtime from 'microtime';
import { RBTree } from 'bintrees';

const shuffle = (arr) => {
	const newArr = arr.slice();
	for (let i = newArr.length - 1; i > 0; i--) {
		const rand = Math.floor(Math.random() * (i + 1));
		[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
	}
	return newArr;
};

const makeData = (length) => {
	let A = new Array(length);
	for (let i = 0; i < length; i++) {
		A[i] = i;
	}

	return shuffle(A);
};

const sizes = [1_000, 10_000, 100_000, 1_000_000];

const testArrays = sizes.map(makeData);

const intLeq = (x, y) => {
	return x <= y;
};
const intCmp = (x, y) => {
	return x - y;
};

const refresh = () => {
	return [
		{ name: 'IndexedSSet', structure: new IndexedSortedSet(intLeq, 1000) },
		{ name: 'SSet', structure: new SortedSet(intLeq, 1000) },
		{ name: 'Collections SSet', structure: new CollectionsSortedSet(undefined, undefined, intCmp) },
		{ name: 'Fastest BTree', structure: new BTreeSet(undefined, intCmp) },
		{ name: 'Functional Tree', structure: FunctionalRedBlackTree() },
		{ name: 'RBTree', structure: new RBTree(intCmp) },
	];
};

const benches = new Array(sizes.length);

for (let k = 0; k < testArrays.length; k++) {
	let structures = refresh();

	const addingRandom = structures.map((a) => {
		let now = Microtime.now();
		if (a.name.localeCompare('Functional Tree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure = a.structure.insert(testArrays[k][i], testArrays[k][i]);
			}
		} else if (a.name.localeCompare('RBTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.insert(testArrays[k][i]);
			}
		} else if (a.name.localeCompare('Fastest BTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.add(testArrays[k][i], undefined);
			}
		} else {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.add(testArrays[k][i]);
			}
		}
		return { name: a.name, duration: (Microtime.now() - now) / 1000 };
	});

	const gettingRandom = structures.map((a) => {
		let now = Microtime.now();
		if (a.name.localeCompare('Functional Tree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.get(testArrays[k][i]);
			}
		} else if (a.name.localeCompare('RBTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.find(testArrays[k][i]);
			}
		} else if (a.name.localeCompare('Fastest BTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.get(testArrays[k][i], undefined);
			}
		} else {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.has(testArrays[k][i]);
			}
		}
		return { name: a.name, duration: (Microtime.now() - now) / 1000 };
	});

	const gettingByIndexRandom = structures
		.filter((a) => a.name === 'IndexedSSet')
		.map((a) => {
			let now = Microtime.now();
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.select(i);
			}
			return { name: a.name, duration: (Microtime.now() - now) / 1000 };
		});

	const deletingRandom = structures.map((a) => {
		let now = Microtime.now();
		if (a.name.localeCompare('Functional Tree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure = a.structure.remove(testArrays[k][i]);
			}
		} else if (a.name.localeCompare('RBTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.remove(testArrays[k][i]);
			}
		} else if (a.name.localeCompare('Fastest BTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.delete(testArrays[k][i], undefined);
			}
		} else {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.delete(testArrays[k][i]);
			}
		}
		return { name: a.name, duration: (Microtime.now() - now) / 1000 };
	});

	const addingSequential = structures.map((a) => {
		let now = Microtime.now();
		if (a.name.localeCompare('Functional Tree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure = a.structure.insert(i, i);
			}
		} else if (a.name.localeCompare('RBTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.insert(i);
			}
		} else if (a.name.localeCompare('Fastest BTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.add(i, undefined);
			}
		} else {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.add(i);
			}
		}
		return { name: a.name, duration: (Microtime.now() - now) / 1000 };
	});

	const gettingSequential = structures.map((a) => {
		let now = Microtime.now();
		if (a.name.localeCompare('Functional Tree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.get(i);
			}
		} else if (a.name.localeCompare('RBTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.find(i);
			}
		} else if (a.name.localeCompare('Fastest BTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.get(i, undefined);
			}
		} else {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.has(i);
			}
		}
		return { name: a.name, duration: (Microtime.now() - now) / 1000 };
	});

	const gettingByIndexSequential = structures
		.filter((a) => a.name === 'IndexedSSet')
		.map((a) => {
			let now = Microtime.now();
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.select(i);
			}
			return { name: a.name, duration: (Microtime.now() - now) / 1000 };
		});

	const deletingSequential = structures.map((a) => {
		let now = Microtime.now();
		if (a.name.localeCompare('Functional Tree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure = a.structure.remove(i);
			}
		} else if (a.name.localeCompare('RBTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.remove(i);
			}
		} else if (a.name.localeCompare('Fastest BTree') === 0) {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.delete(i, undefined);
			}
		} else {
			for (let i = 0; i < testArrays[k].length; i++) {
				a.structure.delete(i);
			}
		}
		return { name: a.name, duration: (Microtime.now() - now) / 1000 };
	});

	benches[k] = {
		data: sizes[k],
		addingRandom,
		gettingRandom,
		gettingByIndexRandom,
		deletingRandom,
		addingSequential,
		gettingSequential,
		gettingByIndexSequential,
		deletingSequential,
	};
}

for (const bench of benches) {
	console.log(bench);
}
