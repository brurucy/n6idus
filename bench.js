import { SortedSet, SortedArraySet } from './src/mod.js';
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

const measure = (A, f) => {
  let now = Microtime.now();

  for (let i = 0; i < A.length; i++) {
    f(A[i]);
  }

  return (Microtime.now() - now) / 1000;
};

const refresh = () => {
  return [
    { name: 'SSet', structure: new SortedSet(intLeq, 1000) },
    //{ name: 'SArray', structure: new SortedArraySet(intLeq) },
    {
      name: 'Collections SSet',
      structure: new CollectionsSortedSet(undefined, undefined, intCmp),
    },
    { name: 'Fastest BTree', structure: new BTreeSet(undefined, intCmp) },
    { name: 'Functional Tree', structure: FunctionalRedBlackTree() },
    { name: 'RBTree', structure: new RBTree(intCmp) },
  ];
};

let structures = refresh();

console.log('Inserting one million, random order.');

const addingOneMillion = structures.map((a) => {
  let now = Microtime.now();
  if (a.name.localeCompare('Functional Tree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.insert(testArrays[3][i], testArrays[3][i]);
    }
  } else if (a.name.localeCompare('RBTree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.insert(testArrays[3][i]);
    }
  } else if (a.name.localeCompare('Fastest BTree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.add(testArrays[3][i], undefined);
    }
  } else {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.add(testArrays[3][i]);
    }
  }
  return { name: a.name, duration: (Microtime.now() - now) / 1000 };
});

for (let item of addingOneMillion) {
  console.log(item);
}

console.log('Getting.');

const gettingOneMillion = structures.map((a) => {
  let now = Microtime.now();
  if (a.name.localeCompare('Functional Tree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.get(testArrays[3][i]);
    }
  } else if (a.name.localeCompare('RBTree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.find(testArrays[3][i]);
    }
  } else if (a.name.localeCompare('Fastest BTree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.get(testArrays[3][i], undefined);
    }
  } else {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.has(testArrays[3][i]);
    }
  }
  return { name: a.name, duration: (Microtime.now() - now) / 1000 };
});

for (let item of gettingOneMillion) {
  console.log(item);
}

console.log('Removing.');

const deletingOneMillion = structures.map((a) => {
  let now = Microtime.now();
  if (a.name.localeCompare('Functional Tree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.remove(testArrays[3][i]);
    }
  } else if (a.name.localeCompare('RBTree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.remove(testArrays[3][i]);
    }
  } else if (a.name.localeCompare('Fastest BTree') === 0) {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.delete(testArrays[3][i], undefined);
    }
  } else {
    for (let i = 0; i < testArrays[3].length; i++) {
      a.structure.delete(testArrays[3][i]);
    }
  }
  return { name: a.name, duration: (Microtime.now() - now) / 1000 };
});

for (let item of deletingOneMillion) {
  console.log(item);
}
