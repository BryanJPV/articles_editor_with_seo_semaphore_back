import { log } from "console";
import { SemaforoSeoUsecase } from "../../domain/semaforo_seo"

/* import { lorca } from "lorca-nlp" */
const lorca = require('lorca-nlp');

export class SemaforoSeoCRUDUC implements SemaforoSeoUsecase {

    async pasive_voice_analisis(frases: string[]) : Promise<number | null> {
        try {
            let contador_frases: number = 0;
            let contador_frases_pasivas: number = 0;
            let frase_aux:any = null;
            frases.forEach((frase:any) => {                
                contador_frases++;
                frase_aux = lorca(frase)
                if(frase_aux.isPassive().get()){
                    contador_frases_pasivas++;
                }
            })
            return parseFloat(((contador_frases_pasivas*100)/contador_frases).toFixed(2));
        } catch (error:Error | any) {
            console.log(error);
            throw new Error("No se pudo realizar el Análisis del uso de Voz Pasiva en las frases, error interno.");
        }
    }
}
