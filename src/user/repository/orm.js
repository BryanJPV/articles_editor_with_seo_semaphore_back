"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.ORMUserRepository = exports.UserORM = void 0;
const user_1 = require("../../domain/user");
const typeorm_1 = require("typeorm");
const crypto_js_1 = require("crypto-js");
let UserORM = class UserORM {
    toUser() {
        let user = new user_1.User();
        user.id = this.id;
        user.username = this.username;
        user.usermail = this.usermail;
        user.password = this.password;
        user.remember_token = this.remember_token;
        user.expiration = this.expiration;
        user.created_at = this.createdAt; //.toDateString();
        user.updated_at = this.updatedAt; //.toDateString();
        return user;
    }
    fromUser(user) {
        this.id = user.id;
        this.username = user.username;
        this.usermail = user.usermail;
        this.password = user.password;
        this.remember_token = user.remember_token;
        this.expiration = user.expiration;
        return this;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true })
], UserORM.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150, nullable: false })
], UserORM.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150, nullable: false })
], UserORM.prototype, "usermail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: false })
], UserORM.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true })
], UserORM.prototype, "remember_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true })
], UserORM.prototype, "expiration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], UserORM.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)()
], UserORM.prototype, "updatedAt", void 0);
UserORM = __decorate([
    (0, typeorm_1.Entity)("users")
], UserORM);
exports.UserORM = UserORM;
class ORMUserRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.userRepoORM = this.dataSource.getRepository(UserORM);
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield this.userRepoORM.findOne({
                where: {
                    usermail: credentials.usermail,
                    password: (0, crypto_js_1.MD5)(credentials.password).toString(),
                }
            });
            if (userModel === null) {
                console.log('Not found!');
                return null;
            }
            let user_id = userModel === null || userModel === void 0 ? void 0 : userModel.toUser().id;
            // Geración Token
            let remember_token = (0, crypto_js_1.MD5)(user_id.toString() + Date.now().toString()).toString();
            // Geración fecha expiración agregandole 1 hora a la fecha de expiración
            let expiration = new Date();
            expiration.setTime(expiration.getTime() + (4 * 60 * 60 * 1000));
            yield this.userRepoORM.update({
                id: user_id
            }, {
                remember_token: remember_token,
                expiration: expiration
            });
            return remember_token;
        });
    }
    checkTokenExpiration(remember_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield this.userRepoORM.findOne({
                where: {
                    remember_token: remember_token,
                }
            });
            if (userModel === null) {
                console.log('Not found!');
                return null;
            }
            let dateNow = new Date();
            if (userModel.expiration < dateNow) {
                return true;
            }
            return false;
        });
    }
    changeUserPassword(old_password, new_password, remember_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield this.userRepoORM.findOne({
                where: {
                    remember_token: remember_token,
                    password: (0, crypto_js_1.MD5)(old_password).toString(),
                }
            });
            if (userModel === null) {
                console.log('Not found!');
                return null;
            }
            let user_id = userModel === null || userModel === void 0 ? void 0 : userModel.toUser().id;
            yield this.userRepoORM.update({
                id: user_id
            }, {
                password: (0, crypto_js_1.MD5)(new_password).toString(),
            });
            return true;
        });
    }
    getUserData(remember_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield this.userRepoORM.findOne({
                where: {
                    remember_token: remember_token,
                }
            });
            if (userModel === null) {
                console.log('Not found!');
                return null;
            }
            return userModel === null || userModel === void 0 ? void 0 : userModel.toUser().username;
        });
    }
}
exports.ORMUserRepository = ORMUserRepository;
