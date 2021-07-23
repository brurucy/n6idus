import { SortedSet, SortedArraySet } from './src/mod.js';
import CollectionsSortedSet from 'collections/sorted-set.js';
import FunctionalRedBlackTree from 'functional-red-black-tree';
import BTree from 'sorted-btree';
let BTreeSet = BTree.default;
import Microtime from 'microtime';
import { RBTree } from 'bintrees';

const shuffle = arr => {
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
  };

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

  for(let i = 0; i < A.length; i++) {
    f(A[i]);
  }

  return (Microtime.now() - now) / 1000;
};

const refresh = () => {

  return [{ name: "SSet", structure: new SortedSet(intLeq, 1000) },
  { name: "SArray", structure: new SortedArraySet(intLeq) },
  { name: "Collections SSet", structure: new CollectionsSortedSet(undefined, undefined, intCmp) },
  { name: "Fastest BTree", structure: new BTreeSet(undefined, intCmp) },
  { name: "Functional Tree", structure: FunctionalRedBlackTree(intCmp) },
  { name: "RBTree", structure: new RBTree(intCmp) }];

};

const structures = refresh();

const adding1000 = structures.map((a) => {
  let now = Microtime.now();
  if (a.name.localeCompare('Functional Tree') !== 0 || a.name.localeCompare('RBTree') !== 0) {
    console.log(a, 'here', a.name, a.name.localeCompare('Functional Tree'));
    console.log(a, 'here', a.name, a.name.localeCompare('RBTree'));
    for (let i = 0; i < testArrays[2].length; i++) {
      a.structure.add(testArrays[2][i]);
    };
  } else {
    console.log('here :/');
    for (let i = 0; i < testArrays[2].length; i++) {
      a.structure.insert(testArrays[2][i]);
    };
  };

  return { name: a.name, duration: (Microtime.now() - now) / 1000 };
})

for(let item of adding1000) {
  console.log(item);
}


