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
exports.UserCRUDUC = void 0;
class UserCRUDUC {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.login(credentials);
        });
    }
    checkTokenExpiration(remember_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.checkTokenExpiration(remember_token);
        });
    }
    changeUserPassword(old_password, new_password, remember_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.changeUserPassword(old_password, new_password, remember_token);
        });
    }
    getUserData(remember_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.getUserData(remember_token);
        });
    }
}
exports.UserCRUDUC = UserCRUDUC;
