"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedArraySet = void 0;
const utils_1 = require("../utils/utils");
class SortedArraySet {
    constructor(compare) {
        this.compare =
            compare || utils_1.defaultComparator;
        this.bucket = [];
    }
    length() {
        return this.bucket.length;
    }
    getMax() {
        return this.max;
    }
    select(nth) {
        if (nth < 0 || nth >= this.bucket.length) {
            return undefined;
        }
        else {
            return this.bucket[nth];
        }
    }
    indexOf(item) {
        return (0, utils_1.indexOf)(this.bucket, this.bucket.length, item, this.compare);
    }
    add(item) {
        const position = this.indexOf(item);
        if (this.compare(this.bucket[position], item) == 0) {
            return undefined;
        }
        else {
            this.bucket.splice(position, 0, item);
            if (this.max === undefined || this.compare(this.max, item) <= 0) {
                this.max = item;
            }
            return item;
        }
    }
    delete(item) {
        const position = this.indexOf(item);
        if (this.compare(this.bucket[position], item) == 0) {
            this.bucket.splice(position, 1);
            if (this.max != undefined) {
                if (this.compare(this.max, item) <= 0) {
                    this.max = this.bucket[this.bucket.length - 1];
                }
            }
            return item;
        }
        else {
            return undefined;
        }
    }
    has(item) {
        const position = this.indexOf(item);
        return this.compare(this.bucket[position], item) == 0;
    }
    remove(nth) {
        const item = this.select(nth);
        if (item === undefined) {
            return undefined;
        }
        else {
            this.bucket.splice(nth, 1);
            if (this.max != undefined) {
                if (this.compare(this.max, item) <= 0) {
                    if (this.bucket.length !== 0) {
                        this.max = this.bucket[this.bucket.length - 1];
                    }
                    else {
                        this.max = undefined;
                    }
                }
            }
            return item;
        }
    }
}
exports.SortedArraySet = SortedArraySet;
//# sourceMappingURL=sorted_array.js.map