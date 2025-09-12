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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandler = void 0;
const express_1 = require("express");
const schemaValidateLoginCredentials_1 = __importDefault(require("./joi_validator/schemaValidateLoginCredentials"));
const schemaValidateChangePassword_1 = __importDefault(require("./joi_validator/schemaValidateChangePassword"));
class UserHandler {
    constructor(userUC) {
        this.userUC = userUC;
    }
    init(apiInstance) {
        let subRouter = (0, express_1.Router)({ mergeParams: true });
        subRouter.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.login(req, res); }));
        subRouter.post('/check_token_expiration', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.checkTokenExpiration(req, res); }));
        subRouter.post('/change_user_password', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.changeUserPassword(req, res); }));
        subRouter.get('/get_user_data', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.getUserData(req, res); }));
        //subRouter.post('/register', async (req, res) => this.register(req,res));
        apiInstance.use('/user', subRouter);
    }
    checkTokenExpiration(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let expiration_res_token = null;
            try {
                expiration_res_token = yield this.userUC.checkTokenExpiration(req.body.remember_token);
                if (expiration_res_token == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo verificar el Token o el Token enviado no existe."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo verificar la Expiración del Token, intente de nuevo."] });
                return;
            }
            res.json({ message: "Verificación exitosa.", data: expiration_res_token });
        });
    }
    login(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                usermail: req.body.usermail,
                password: req.body.password,
            };
            let array_errors_schema_validator = [];
            try {
                const value = yield schemaValidateLoginCredentials_1.default.validateAsync(payload, { abortEarly: false });
            }
            catch (error) {
                //console.log(error.details);
                error.details.forEach((error_detail) => {
                    array_errors_schema_validator.push(error_detail.message);
                });
                res.status(400);
                res.json({ error: array_errors_schema_validator });
                return;
            }
            let login_res_token = null;
            try {
                login_res_token = yield this.userUC.login(payload);
                if (login_res_token == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo logear, credenciales erroneas."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo logear o credenciales erroneas, intente de nuevo."] });
                return;
            }
            res.json({ message: "Login exitoso.", data: login_res_token });
        });
    }
    changeUserPassword(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let expiration_res_token = null;
            try {
                expiration_res_token = yield this.userUC.checkTokenExpiration(req.body.remember_token);
                if (expiration_res_token == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo verificar el Token o el Token enviado no existe."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo verificar la Expiración del Token, intente de nuevo."] });
                return;
            }
            let old_password = (typeof req.body.old_password !== "string") ? req.body.old_password.toString() : req.body.old_password;
            let new_password = (typeof req.body.new_password !== "string") ? req.body.new_password.toString() : req.body.new_password;
            const payload = {
                old_password: old_password,
                new_password: new_password,
            };
            let array_errors_schema_validator = [];
            try {
                const value = yield schemaValidateChangePassword_1.default.validateAsync(payload, { abortEarly: false });
            }
            catch (error) {
                //console.log(error.details);
                error.details.forEach((error_detail) => {
                    array_errors_schema_validator.push(error_detail.message);
                });
                res.status(400);
                res.json({ error: array_errors_schema_validator });
                return;
            }
            let change_password_res = null;
            try {
                change_password_res = yield this.userUC.changeUserPassword(req.body.old_password, req.body.new_password, req.body.remember_token);
                if (change_password_res == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo cambiar la Contraseña Actual, la contraseña Anterior es incorrecta."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_b = error.message) !== null && _b !== void 0 ? _b : "No se pudo cambiar la Contraseña Actual, intente de nuevo."] });
                return;
            }
            res.json({ message: "Cambio de Contraseña exitoso.", data: change_password_res });
        });
    }
    getUserData(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let user_data_res = null;
            try {
                user_data_res = yield this.userUC.getUserData(req.body.remember_token);
                if (user_data_res == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo consultar los datos del Usuario."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo consultar los datos del Usuario, intente de nuevo."] });
                return;
            }
            res.json({ message: "Consulta exitosa.", data: user_data_res });
        });
    }
}
exports.UserHandler = UserHandler;
