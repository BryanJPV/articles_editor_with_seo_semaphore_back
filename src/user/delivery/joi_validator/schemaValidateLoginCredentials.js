"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schemaValidateLoginCredentials = joi_1.default.object().keys({
    usermail: joi_1.default.string()
        .min(2)
        .max(150)
        .required()
        .messages({
        'string.empty': 'El campo Mail de Usuario no puede estar vacío',
        'string.min': 'El campo Mail de Usuario no puede tener tan pocos caracteres',
        'string.max': 'El campo Mail de Usuario solo puede tener 150 caracteres',
        'any.required': 'El campo Mail de Usuario es requerido',
    }),
    password: joi_1.default.string()
        .min(2)
        .max(150)
        .required()
        .messages({
        'string.empty': 'El campo Contraseña no puede estar vacío',
        'string.min': 'El campo Contraseña no puede tener tan pocos caracteres',
        'string.max': 'El campo Contraseña solo puede tener 150 caracteres',
        'any.required': 'El campo Contraseña es requerido',
    }),
});
exports.default = schemaValidateLoginCredentials;
