export declare type DefaultComparable = number | string | Date | boolean | null | undefined | (number | string)[] | {
    valueOf: () => number | string | Date | boolean | null | undefined | (number | string)[];
};
export declare function defaultComparator(a: DefaultComparable, b: DefaultComparable): number;
export interface NumberIndexable<K> {
    [x: number]: K;
}
export declare function indexOf<K, T>(container: NumberIndexable<K>, high: number, item: T, cmp: (a: K, b: T) => number): number;
export declare function mostSignificantBit(value: number): number;
export declare function leastSignificantBit(value: number): number;
