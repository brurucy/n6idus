import { Index } from '../src/index.js';

test('calculate prefix sum, simple', () => {
  let lengths = [1, 6, 3, 9, 2];
  let idx = new Index(lengths);
  expect(lengths.cumSumTil(1)).toEqual(7);
});
