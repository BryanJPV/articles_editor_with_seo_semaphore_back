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
exports.SemaforoSeoHandler = void 0;
const express_1 = require("express");
class SemaforoSeoHandler {
    constructor(semaforoSeoUC) {
        this.semaforoSeoUC = semaforoSeoUC;
    }
    init(apiInstance) {
        let subRouter = (0, express_1.Router)({ mergeParams: true });
        subRouter.post('/pasive_voice', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.pasive_voice_analisis(req, res); }));
        apiInstance.use('/semaforo_seo', subRouter);
    }
    pasive_voice_analisis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let pasive_voice_analisis_porcentaje_res = null;
            try {
                if (req.body != null && req.body != undefined) {
                    pasive_voice_analisis_porcentaje_res = yield this.semaforoSeoUC.pasive_voice_analisis(req.body);
                }
                if (pasive_voice_analisis_porcentaje_res == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo realizar el Análisis del uso de Voz Pasiva en las frases.1"] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo realizar el Análisis del uso de Voz Pasiva en las frases.2"] });
                return;
            }
            res.json(pasive_voice_analisis_porcentaje_res);
        });
    }
}
exports.SemaforoSeoHandler = SemaforoSeoHandler;
