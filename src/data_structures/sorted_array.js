"use strict";
exports.__esModule = true;
exports.SortedArraySet = void 0;
var utils_1 = require("../utils/utils");
var SortedArraySet = /** @class */ (function () {
    function SortedArraySet(compare) {
        this.compare =
            compare || utils_1.defaultComparator;
        this.bucket = [];
    }
    SortedArraySet.prototype.getMax = function () {
        return this.max;
    };
    SortedArraySet.prototype.select = function (nth) {
        if (nth < 0 || nth >= this.bucket.length) {
            return undefined;
        }
        else {
            return this.bucket[nth];
        }
    };
    SortedArraySet.prototype.indexOf = function (item) {
        return (0, utils_1.indexOf)(this.bucket, this.bucket.length, item, this.compare);
    };
    SortedArraySet.prototype.add = function (item) {
        var position = this.indexOf(item);
        if (this.compare(this.bucket[position], item) == 0) {
            return undefined;
        }
        else {
            this.bucket.splice(position, 0, item);
            if (this.max === undefined || this.compare(this.max, item)) {
                this.max = item;
            }
            return item;
        }
    };
    SortedArraySet.prototype["delete"] = function (item) {
        var position = this.indexOf(item);
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
    };
    SortedArraySet.prototype.has = function (item) {
        var position = this.indexOf(item);
        return this.compare(this.bucket[position], item) == 0;
    };
    SortedArraySet.prototype.remove = function (nth) {
        var item = this.select(nth);
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
    };
    return SortedArraySet;
}());
exports.SortedArraySet = SortedArraySet;
