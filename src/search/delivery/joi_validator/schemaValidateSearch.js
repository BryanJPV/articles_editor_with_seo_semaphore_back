"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schemaValidateSearch = joi_1.default.object().keys({
    search_string: joi_1.default.string()
        .min(2)
        .max(150)
        .required()
        .messages({
        'string.empty': 'El campo Busqueda no puede estar vacío',
        'string.min': 'El campo Busqueda no puede tener tan pocos caracteres',
        'string.max': 'El campo Busqueda solo puede tener 150 caracteres',
        'any.required': 'El campo Busqueda es requerido',
    }),
});
exports.default = schemaValidateSearch;
