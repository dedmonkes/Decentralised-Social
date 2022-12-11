"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const pda_1 = require("./pda");
var Api;
(function (Api) {
    Api.fetchUserProfileByIdentifier = (identifierAddress, programs) => __awaiter(this, void 0, void 0, function* () {
        const userProfileAddress = pda_1.Derivation.deriveUserProfileAddress(identifierAddress);
        const profile = yield programs.profilesProgram.account.user.fetch(userProfileAddress);
        return profile;
    });
    Api.fetchUserProfileByOwnerPubkey = (ownerAddress, programs) => __awaiter(this, void 0, void 0, function* () {
        const ownerRecord = yield Api.fetchOwnerRecord(ownerAddress, programs);
        const userProfile = yield Api.fetchUserProfileByIdentifier(ownerRecord.identifier, programs);
        return userProfile;
    });
    Api.fetchOwnerRecord = (ownerAddress, programs) => __awaiter(this, void 0, void 0, function* () {
        const ownerRecordAddress = pda_1.Derivation.deriveOwnerRecordAddress(ownerAddress);
        const ownerRecord = programs.identifiersProgram.account.ownerRecord.fetch(ownerRecordAddress);
        return ownerRecord;
    });
})(Api = exports.Api || (exports.Api = {}));
//# sourceMappingURL=api.js.map