import { Express, Router, Request, Response } from "express"
import { SemaforoSeoUsecase } from "../../domain/semaforo_seo"

export class SemaforoSeoHandler {
    semaforoSeoUC: SemaforoSeoUsecase;

    constructor(semaforoSeoUC: SemaforoSeoUsecase) {
        this.semaforoSeoUC = semaforoSeoUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.post('/pasive_voice', async (req, res) => this.pasive_voice_analisis(req,res));

        apiInstance.use('/semaforo_seo', subRouter)
    }

    async pasive_voice_analisis (req: Request, res: Response) {
        let pasive_voice_analisis_porcentaje_res:any = null;
        try {
            if(req.body != null && req.body != undefined){
                pasive_voice_analisis_porcentaje_res = await this.semaforoSeoUC.pasive_voice_analisis(req.body);
            }
            if (pasive_voice_analisis_porcentaje_res == null) {
                res.status(400)
                res.json( { error : [ "No se pudo realizar el Análisis del uso de Voz Pasiva en las frases.1" ] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo realizar el Análisis del uso de Voz Pasiva en las frases.2" ] }); 
            return;
        }
        res.json(pasive_voice_analisis_porcentaje_res);
    }
}