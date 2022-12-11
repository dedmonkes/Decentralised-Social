"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlignPrograms = exports.Api = exports.Derivation = void 0;
const anchor_1 = require("@project-serum/anchor");
const constants_1 = require("./constants");
const align_governance_1 = require("./idls/align_governance");
const identifiers_1 = require("./idls/identifiers");
const leaf_1 = require("./idls/leaf");
const multigraph_1 = require("./idls/multigraph");
const profiles_1 = require("./idls/profiles");
var pda_1 = require("./pda");
Object.defineProperty(exports, "Derivation", { enumerable: true, get: function () { return pda_1.Derivation; } });
__exportStar(require("./types"), exports);
__exportStar(require("./filters"), exports);
__exportStar(require("./identifiers"), exports);
__exportStar(require("./constants"), exports);
var api_1 = require("./api");
Object.defineProperty(exports, "Api", { enumerable: true, get: function () { return api_1.Api; } });
const createAlignPrograms = (connection, wallet) => {
    const provider = new anchor_1.AnchorProvider(connection, wallet, { commitment: "confirmed" });
    const alignGovernanceProgram = new anchor_1.Program(align_governance_1.IDL, constants_1.ALIGN_PROGRAM_ID, provider);
    const identifiersProgram = new anchor_1.Program(identifiers_1.IDL, constants_1.IDENTIFIERS_PROGRAM_ID, provider);
    const multigraphProgram = new anchor_1.Program(multigraph_1.IDL, constants_1.MULTIGRAPH_PROGRAM_ID, provider);
    const profilesProgram = new anchor_1.Program(profiles_1.IDL, constants_1.PROFILES_PROGRAM_ID, provider);
    const leafProgram = new anchor_1.Program(leaf_1.IDL, constants_1.LEAF_PROGRAM_ID, provider);
    return {
        alignGovernanceProgram,
        identifiersProgram,
        multigraphProgram,
        profilesProgram,
        leafProgram,
        provider
    };
};
exports.createAlignPrograms = createAlignPrograms;
//# sourceMappingURL=index.js.map