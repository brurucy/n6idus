export declare class SortedArraySet<K = any> {
    bucket: K[];
    max: K | undefined;
    private readonly compare;
    constructor(compare?: (a: K, b: K) => number);
    length(): number;
    getMax(): K | undefined;
    select(nth: number): K | undefined;
    indexOf(item: K): number;
    add(item: K): K | undefined;
    delete(item: K): K | undefined;
    has(item: K): boolean;
    remove(nth: number): K | undefined;
}
