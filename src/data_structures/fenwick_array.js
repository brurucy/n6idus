"use strict";
exports.__esModule = true;
exports.FenwickArray = void 0;
var utils_1 = require("../utils/utils");
function simpleProbe(item) {
    return item;
}
var FenwickArray = /** @class */ (function () {
    function FenwickArray(arr, probe) {
        var length = arr.length;
        this.innerStructure = new Array(length);
        probe = probe || simpleProbe;
        this.innerStructure[0] = probe(arr[0]);
        for (var i = 1; i < length; i++) {
            this.innerStructure[i] = this.innerStructure[i - 1] + probe(arr[i]);
        }
        for (var i = length - 1; i > 0; i--) {
            var lowerBound = (i & (i + 1)) - 1;
            if (lowerBound >= 0) {
                this.innerStructure[i] -= this.innerStructure[lowerBound];
            }
        }
    }
    FenwickArray.prototype.prefixSum = function (index) {
        if (index > this.innerStructure.length) {
            return undefined;
        }
        var sum = 0;
        while (index > 0)
            (sum += this.innerStructure[index - 1]), (index &= index - 1);
        return sum;
    };
    FenwickArray.prototype.increaseLength = function (index) {
        var length = this.innerStructure.length;
        while (index < length)
            (this.innerStructure[index] += 1), (index |= index + 1);
    };
    FenwickArray.prototype.decreaseLength = function (index) {
        var length = this.innerStructure.length;
        while (index < length)
            (this.innerStructure[index] -= 1), (index |= index + 1);
    };
    FenwickArray.prototype.indexOf = function (prefixSum) {
        var length = this.innerStructure.length;
        var ans = 0, x = (0, utils_1.mostSignificantBit)(length) * 2;
        while (x && x === (x | 0)) {
            var lsb = (0, utils_1.leastSignificantBit)(x);
            if (x <= length && this.innerStructure[x - 1] <= prefixSum) {
                prefixSum -= this.innerStructure[x - 1];
                ans = x;
                x += lsb / 2;
            }
            else {
                x += lsb / 2 - lsb;
            }
        }
        return ans;
    };
    return FenwickArray;
}());
exports.FenwickArray = FenwickArray;
