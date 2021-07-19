import { SortedSet } from './src/mod.js';
import { SortedArraySet } from './src/sorted_array.js';
import Microtime from 'microtime';

const getShuffledArr = arr => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
};

let thousand = new Array(1000);
for (let i = 0; i < thousand.length; i++) {
  thousand[i] = i;
}
thousand = getShuffledArr(thousand);

let tenThousand = new Array(10000);
for (let i = 0; i < tenThousand.length; i++) {
  tenThousand[i] = i;
}
tenThousand = getShuffledArr(tenThousand);

let hundredThousand = new Array(100_000);
for (let i = 0; i < hundredThousand.length; i++) {
  hundredThousand[i] = i;
}
hundredThousand = getShuffledArr(hundredThousand);

let oneMillion = new Array(1_000_000);
for (let i = 0; i < oneMillion.length; i++) {
  oneMillion[i] = i;
}
oneMillion = getShuffledArr(oneMillion);

// Base js sorted array

const intLeq = (x, y) => {
  return x <= y;
};

let sortedSet = new SortedSet(intLeq, 1000);
let arr = new SortedArraySet(intLeq);

let now = Microtime.now();
for (let i = 0; i < thousand.length; i++) {
  arr.add(thousand[i]);
}
console.log('SortedArraySet#1000', (Microtime.now() - now) / 1000);

now = Microtime.now();
for (let i = 0; i < thousand.length; i++) {
  sortedSet.add(thousand[i]);
}
console.log('SortedSet#1000', (Microtime.now() - now) / 1000);

sortedSet = new SortedSet(intLeq, 1000);
arr = new SortedArraySet(intLeq);

//
now = Microtime.now();
for (let i = 0; i < tenThousand.length; i++) {
  arr.add(tenThousand[i]);
}
console.log('SortedArraySet#10000', (Microtime.now() - now) / 1000);

now = Microtime.now();
for (let i = 0; i < tenThousand.length; i++) {
  sortedSet.add(tenThousand[i]);
}
console.log('SortedSet#10000', (Microtime.now() - now) / 1000);

sortedSet = new SortedSet(intLeq, 1000);
arr = new SortedArraySet(intLeq);

now = Microtime.now();
for (let i = 0; i < hundredThousand.length; i++) {
  arr.add(hundredThousand[i]);
}
console.log('SortedArraySet#100000', (Microtime.now() - now) / 1000);

now = Microtime.now();
for (let i = 0; i < hundredThousand.length; i++) {
  sortedSet.add(hundredThousand[i]);
}
console.log('SortedSet#100000', (Microtime.now() - now) / 1000);
