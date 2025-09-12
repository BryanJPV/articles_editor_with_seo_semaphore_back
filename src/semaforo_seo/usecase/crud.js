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
exports.SemaforoSeoCRUDUC = void 0;
/* import { lorca } from "lorca-nlp" */
const lorca = require('lorca-nlp');
class SemaforoSeoCRUDUC {
    pasive_voice_analisis(frases) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let contador_frases = 0;
                let contador_frases_pasivas = 0;
                let frase_aux = null;
                frases.forEach((frase) => {
                    contador_frases++;
                    frase_aux = lorca(frase);
                    if (frase_aux.isPassive().get()) {
                        contador_frases_pasivas++;
                    }
                });
                return parseFloat(((contador_frases_pasivas * 100) / contador_frases).toFixed(2));
            }
            catch (error) {
                console.log(error);
                throw new Error("No se pudo realizar el Análisis del uso de Voz Pasiva en las frases, error interno.");
            }
        });
    }
}
exports.SemaforoSeoCRUDUC = SemaforoSeoCRUDUC;
