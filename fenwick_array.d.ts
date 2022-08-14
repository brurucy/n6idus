declare type anyToInt<K> = (a: K) => number;
export declare class FenwickArray {
    readonly innerStructure: number[];
    constructor(arr: Array<any>, probe?: anyToInt<any>);
    prefixSum(index: number): number | undefined;
    increaseLength(index: number): void;
    decreaseLength(index: number): void;
    indexOf(prefixSum: number): number;
}
export {};
