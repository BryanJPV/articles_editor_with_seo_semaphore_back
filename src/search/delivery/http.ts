import { Express, Router, Request, Response } from "express"
import { SearchUsecase } from "../../domain/search"

import schemaValidateSearch from "./joi_validator/schemaValidateSearch"

export class SearchHandler {
    searchUC: SearchUsecase;

    constructor(searchUC: SearchUsecase) {
        this.searchUC = searchUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.post('/', async (req, res) => this.search(req,res));
        //subRouter.get('/sort_words', async (req, res) => this.sort_words(req,res));

        apiInstance.use('/search', subRouter)
    }
    /* async sort_words (req: Request, res: Response) {
        let search_res = await this.searchUC.sort_words();
        res.json({ data: search_res });
    } */

    async search (req: Request, res: Response) {
        const payload = {
            search_string: req.body.search_string,
        };
        //console.log(payload);

        let array_errors_schema_validator:string[] = [];
        try {
            const value = await schemaValidateSearch.validateAsync(payload, { abortEarly: false });
        } catch (error:Error | any) {
            //console.log(error.details);
            error.details.forEach((error_detail:any) => {
                array_errors_schema_validator.push(error_detail.message)
            });
            res.status(400)
            res.json({error: array_errors_schema_validator! }); 
            return;
        }

        /* let array_labels_aux:string[] = [];
        if(req.body.array_labels != null && req.body.array_labels != undefined) {
            req.body.array_labels.forEach((label:any) => {
                array_labels_aux.push(label)
            });
        } */
        let search_res = null;
        try {
            search_res = await this.searchUC.search(req.body.search_string/* , array_labels_aux */);
            if (search_res == null) {
                res.status(400)
                res.json( { error : ["No se pudo realizar el proceso de busqueda, intente de nuevo."] } )
                return;
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo realizar el proceso de busqueda, intente de nuevo." ] }); 
            return;
        }

        res.json( search_res );
    }
}