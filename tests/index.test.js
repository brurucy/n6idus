import { FenwickArray } from '../src';

test('build index, simple', () => {
  let lengths = [1, 6, 3, 9, 2];
  let fenwickArray = [1, 7, 3, 19, 2];
  let index = new FenwickArray(lengths);
  expect(fenwickArray).toEqual(index.innerStructure);
});

test('prefix sum, simple', () => {
  let lengths = [1, 6, 3, 9, 2];
  let index = new FenwickArray(lengths);
  let prefixSum = [1, 7, 10, 19, 21];

  let indices = [1, 2, 3, 4, 5];
  //let indices = [0, 1, 2, 3, 4];
  let calculatedPrefixSum = indices.map((length) => index.prefixSum(length));

  expect(prefixSum).toEqual(calculatedPrefixSum);
});

test('update, simple, adding', () => {
  let lengths = [1, 6, 3, 9, 2];
  let index = new FenwickArray(lengths);
  let prefixSum = [1, 7, 10, 19, 21];

  let indices = [1, 2, 3, 4, 5];
  let calculatedPrefixSum = indices.map((length) => index.prefixSum(length));
  expect(prefixSum).toEqual(calculatedPrefixSum);

  lengths[1] += 1;
  index.increaseLength(1);
  prefixSum = [1, 8, 11, 20, 22];
  calculatedPrefixSum = indices.map((length) => index.prefixSum(length));
  expect(prefixSum).toEqual(calculatedPrefixSum);
});

test('update, simple, removing', () => {
  let lengths = [1, 6, 3, 9, 2];
  let index = new FenwickArray(lengths);
  let prefixSum = [1, 7, 10, 19, 21];

  let indices = [1, 2, 3, 4, 5];
  let calculatedPrefixSum = indices.map((length) => index.prefixSum(length));
  expect(prefixSum).toEqual(calculatedPrefixSum);

  lengths[1] -= 1;
  index.decreaseLength(1);
  prefixSum = [1, 6, 9, 18, 20];
  calculatedPrefixSum = indices.map((length) => index.prefixSum(length));
  expect(prefixSum).toEqual(calculatedPrefixSum);
});

test('indexOf, simple', () => {
  let lengths = [1, 6, 3, 9, 2];
  let index = new FenwickArray(lengths);

  expect(index.indexOf(0)).toEqual(0);
  expect(index.indexOf(1)).toEqual(1);
  expect(index.indexOf(2)).toEqual(1);
  expect(index.indexOf(3)).toEqual(1);
  expect(index.indexOf(4)).toEqual(1);
  expect(index.indexOf(5)).toEqual(1);
  expect(index.indexOf(6)).toEqual(1);

  expect(index.indexOf(7)).toEqual(2);
  expect(index.indexOf(8)).toEqual(2);
  expect(index.indexOf(9)).toEqual(2);

  expect(index.indexOf(10)).toEqual(3);
  expect(index.indexOf(11)).toEqual(3);
  expect(index.indexOf(12)).toEqual(3);
  expect(index.indexOf(13)).toEqual(3);
  expect(index.indexOf(14)).toEqual(3);
  expect(index.indexOf(15)).toEqual(3);
  expect(index.indexOf(16)).toEqual(3);
  expect(index.indexOf(17)).toEqual(3);
  expect(index.indexOf(18)).toEqual(3);

  expect(index.indexOf(19)).toEqual(4);
  expect(index.indexOf(20)).toEqual(4);

});
