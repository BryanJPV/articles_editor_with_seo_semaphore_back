import { Router, Request, Response } from "express"
import { NewsCommonUsecase } from "../../domain/news"

export class NewsCommonHandler {
    newsUC: NewsCommonUsecase;

    constructor(newsUC: NewsCommonUsecase) {
        this.newsUC = newsUC;
    }

    init(apiInstance: Router) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/list', async (req, res) => this.list(req,res));
        subRouter.get('/by_pagination/:inicio/:cantidad', async (req, res) => this.listByPagination(req,res));
        subRouter.get('/by_id/:id', async (req, res) => this.byID(req,res));
        subRouter.get('/by_seo_url/:seo_url', async (req, res) => this.bySeoURL(req,res));

        apiInstance.use('/news', subRouter)
    }

    async list (req: Request, res: Response) {
        let news_res = await this.newsUC.list();
        res.json( news_res );
    }
    async listByPagination (req: Request, res: Response) {
        let inicio:number = 0;
        if (req.params.inicio !== undefined && req.params.inicio !== null){
            if (parseInt(req.params.inicio) < 1){
                inicio = 0;
            } else {
                inicio = parseInt(req.params.inicio);
            }
        }
        let cantidad:number = 0;
        if (req.params.cantidad !== undefined && req.params.cantidad !== null){
            if (parseInt(req.params.cantidad) < 1){
                cantidad = 165163815613351;
            } else {
                cantidad = parseInt(req.params.cantidad);
            }
        }        
        let events_res = await this.newsUC.listByPagination(inicio, cantidad);
        res.json( events_res );
    }
    async byID (req: Request, res: Response) {
        let id_to_search = parseInt(req.params.id);

        let news = null;
        try {
            news = await this.newsUC.byID(id_to_search);
            if (news == null) {
                res.status(400)
                res.json( { error : ["No se encontró la Noticia."] } )
                return;
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se encontró la Noticia." ] }); 
            return;
        }

        res.json( news );
    }
    async bySeoURL (req: Request, res: Response) {
        let seo_url_to_search = req.params.seo_url;

        let news = null;
        try {
            news = await this.newsUC.bySeoURL(seo_url_to_search);
            if (news == null) {
                res.status(400)
                res.json( { error : ["No se encontró la Noticia."] } )
                return;
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se encontró la Noticia." ] }); 
            return;
        }
        res.json( news );
    }
}