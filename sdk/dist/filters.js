"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterFactory = void 0;
const bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");
const filterFactory = (offset, bytes) => {
    return {
        memcmp: {
            offset: offset,
            bytes: bytes_1.bs58.encode(bytes),
        },
    };
};
exports.filterFactory = filterFactory;
//   export const getOwnerRecord = (
//     state: PhaseStateEnum
//   ): web3.MemcmpFilter => {
//     return filterFactory(PHASE_STATE_OFFSET, Uint8Array.of(state));
//   };
//# sourceMappingURL=filters.js.map