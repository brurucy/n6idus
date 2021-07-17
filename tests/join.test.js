import { antiJoin, join, joinMap } from '../src/mod.js';

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
// Testing the joins

test('[(1, 2, 3), (2, 3, 4)] join [(1, 6, 7), (1, 6, 9), (2, 4, 5)]', () => {
  const tupleArrOne = [];

  tupleArrOne.push([1, 2, 3]);
  tupleArrOne.push([2, 3, 4]);

  const tupleArrTwo = [];

  tupleArrTwo.push([1, 6, 7]);
  tupleArrTwo.push([1, 6, 9]);
  tupleArrTwo.push([2, 4, 5]);

  const answer = [
    [1, [2, 3], [6, 7]],
    [1, [2, 3], [6, 9]],
    [2, [3, 4], [4, 5]],
  ];
  const calc = join(tupleArrOne, tupleArrTwo, keyLeq);
  expect(calc).toEqual(answer);
});

test('[(1, 2, 3), (2, 3, 4)] join [(5, 6, 7), (9, 6, 9), (11, 4, 5)]', () => {
  const tupleArrOne = [
    [1, 2, 3],
    [2, 3, 4],
  ];
  const tupleArrTwo = [
    [5, 6, 7],
    [9, 6, 9],
    [11, 4, 5],
  ];
  const answer = [];
  const calc = join(tupleArrOne, tupleArrTwo, keyLeq);
  expect(calc).toEqual(answer);
});

test('[(3, 2, 1), (6, 3, 4)] joinMap [(3, 2, 4), (6, 3, 9)]', () => {
  const tupleArrOne = [
    [3, 2, 1],
    [6, 3, 4],
  ];
  const tupleArrTwo = [
    [3, 2, 4],
    [6, 3, 9],
  ];
  const answer = [
    [1, 2, 4],
    [4, 3, 9],
  ];
  const transposition = ([key, [leftP, leftO], [rightP, rightO]]) => [
    leftO,
    leftP,
    rightO,
  ];
  const calc = joinMap(tupleArrOne, tupleArrTwo, keyLeq, transposition);
  expect(calc).toEqual(answer);
});

test('[(3, 2, 1), (5, 4, 9), (6, 3, 4)] antijoin[(3, 2, 1), (6, 3, 4)]', () => {
  const tupleArrOne = [
    [3, 2, 1],
    [5, 4, 9],
    [6, 3, 4],
  ];
  const tupleArrTwo = [
    [3, 2, 1],
    [6, 3, 4],
  ];
  const answer = [[5, 4, 9]];
  const calc = antiJoin(tupleArrOne, tupleArrTwo, leq);
  expect(calc).toEqual(answer);
});

test('[(3, 2, 1), (5, 4, 9), (6, 3, 4)] antijoin []', () => {
  const tupleArrOne = [
    [3, 2, 1],
    [5, 4, 9],
    [6, 3, 4],
  ];
  const tupleArrTwo = [];
  const answer = tupleArrOne;
  const calc = antiJoin(tupleArrOne, tupleArrTwo, leq);
  expect(calc).toEqual(answer);
});
