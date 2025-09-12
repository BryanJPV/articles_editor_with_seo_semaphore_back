"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schemaValidateUpdate = joi_1.default.object().keys({
    position: joi_1.default.number()
        .min(1)
        .required()
        .messages({
        'number.empty': 'El campo Posición no puede estar vacío',
        'number.min': 'El campo Posición no posee un valor correcto, debe ser un valor mayor de 1.',
        'any.required': 'El campo Posición es requerido',
    }),
    tipo: joi_1.default.number()
        .min(1)
        .max(5)
        .required()
        .messages({
        'number.empty': 'El campo Tipo no puede estar vacío',
        'number.min': 'El campo Tipo no posee un valor correcto, debe ser un valor entre 1 y 5.',
        'any.required': 'El campo Tipo es requerido',
    }),
});
exports.default = schemaValidateUpdate;
