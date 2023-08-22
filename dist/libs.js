"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = void 0;
const capitalizeFirstLetter = (str) => {
    const res = str == '' ? '' : str.slice(0, 1).toUpperCase() + str.slice(1);
    // const res = str;
    return res;
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
//# sourceMappingURL=libs.js.map