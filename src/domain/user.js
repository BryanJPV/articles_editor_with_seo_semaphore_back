"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    //rol_id: number;
    constructor() {
        this.id = 0;
        this.username = "";
        this.usermail = "";
        this.password = "";
        this.remember_token = "";
        this.expiration = new Date();
        this.created_at = new Date();
        this.updated_at = new Date();
        //this.rol_id = 0;
    }
}
exports.User = User;
