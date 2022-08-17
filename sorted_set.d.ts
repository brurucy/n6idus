import { SortedArraySet } from "./sorted_array.js";
export default class IndexedSortedArraySet<K = any> implements Iterable<K> {
    readonly buckets: SortedArraySet<K>[];
    private readonly bucketSize;
    private readonly compare;
    length: number;
    private index;
    constructor(bucketSize?: number, compare?: (a: K, b: K) => number);
    private buildIndex;
    toString(): string;
    [Symbol.iterator](): Iterator<K>;
    private balance;
    private bucketsIndexOf;
    push(item: K): K | undefined;
    append(item: K): K;
    delete(item: K): K | undefined;
    remove(nth: number): K | undefined;
    protected locate(nth: number): undefined | [number, number];
    private locateNextOrPrevious;
    makeCursor(from: number, forward: boolean): Generator<[number, K | undefined], void, boolean>;
    private binaryIteratingOperation;
    intersection(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K>;
    union(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K>;
    difference(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K>;
    symmetricDifference(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K>;
    filter(callbackFn: (item: K) => boolean): IndexedSortedArraySet<K>;
    map<V>(callbackFn: (item: K) => V, newCmp?: (a: V, b: V) => number): IndexedSortedArraySet<V>;
    reduce<V>(callbackFn: (accumulator: V, currentValue: K, currentIndex: number) => V, initialValue: V): V;
}
