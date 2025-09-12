import { NewsContent } from '../../domain/news_content';
import { Router, Request, Response } from "express"
import { News, NewsAdminUsecase } from "../../domain/news"

import { UserUsecase } from "../../domain/user"

import { MulterError } from "multer"

import uploadImagenNews from "./multer/uploadImages"
import schemaValidateRegister from "./joi_validator/schemaRegister"


export class NewsAdminHandler {
    newsUC: NewsAdminUsecase;
    userUC: UserUsecase;

    constructor(newsUC: NewsAdminUsecase, userUC: UserUsecase) {
        this.newsUC = newsUC;
        this.userUC = userUC;
    }

    init(apiInstance: Router) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/list', async (req, res) => this.list(req,res));
        subRouter.get('/by_id/:id', async (req, res) => this.byID(req,res));

        subRouter.post('/register', async (req, res) => {
            uploadImagenNews(req, res, (err:any) => {
                /* console.log("error");
                console.log(err); */
                // err tiene el error que retorna el callback de la validación de Multer
                // En caso que err sea un error de multer
                if (err instanceof MulterError) {
                    // A Multer error occurred when uploading.
                    res.status(400)
                    res.json({ error: [ err.message! ] }); 
                    return;
                }
                // En caso que err sea un mensaje de error simple en un string
                if (typeof err == "string") {
                    // An unknown error occurred when uploading.
                    res.status(400)
                    res.json({ error: [ err! ] }); 
                    return;
                }
                this.register(req,res)
            })
        });
        subRouter.put('/update/:id', async (req, res) => {
            uploadImagenNews(req, res, (err:any) => {
                /* console.log("error");
                console.log(err); */
                // err tiene el error que retorna el callback de la validación de Multer
                // En caso que err sea un error de multer
                if (err instanceof MulterError) {
                    // A Multer error occurred when uploading.
                    res.status(400)
                    res.json({ error: [ err.message! ] }); 
                    return;
                }
                // En caso que err sea un mensaje de error simple en un string
                if (typeof err == "string") {
                    // An unknown error occurred when uploading.
                    res.status(400)
                    res.json({ error: [ err! ] }); 
                    return;
                }
                this.update(req,res)
            })
        });
        subRouter.delete('/delete/:id', async (req, res) => this.delete(req,res));

        apiInstance.use('/news', subRouter)
    }

    async verifyAuth (req: Request, res: Response) {
        if (req.headers.authorization === undefined || req.headers.authorization == '') {
            res.status(403).send({ error: ["No estas autorizado para acceder a esta funcionalidad, intente Iniciar Sesión primero."] });
            return false;
        }

        try {
            if (req.headers.authorization !== null || req.headers.authorization !== undefined || req.headers.authorization !== '') {
                let token: string | undefined = req.headers.authorization
                let expiration: boolean|null = null;
                if(token !== undefined){
                    token = token.replace("Bearer ", "")
                    expiration = await this.userUC.checkTokenExpiration(token);

                    if(expiration){
                        res.status(403).send({ error: ["No estas autorizado para acceder a esta funcionalidad, intente Iniciar Sesión primero."] });
                        return false;
                    }
                }
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(403).send({ error: ["No estas autorizado para acceder a esta funcionalidad, intente Iniciar Sesión primero."] });
            return false;
        }

        return true
    }

    async parsingSeoUrl (seo_url: string) {
        return seo_url.trim()
                        .toLowerCase()
                        .replace(/ /g, '_')
                        .replace(/ +/g, '-')
                        .replace(/á/g, 'a')
                        .replace(/é/g, 'e')
                        .replace(/í/g, 'i')
                        .replace(/ó/g, 'o')
                        .replace(/ú/g, 'u')
                        .replace(/ñ/g, 'n')
                        .replace(/[^a-z0-9-_.]/g, '')
    }

    async list (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        let news_res = await this.newsUC.list();
        res.json( news_res );
    }
    async byID (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

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
    async register (req: Request,  res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        // Parsing Seo_Url
        let seo_url_parseado:string = await this.parsingSeoUrl(req.body.seo_url);

        const payload = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            seo_url: seo_url_parseado,
            keywords: req.body.keywords,
            status: parseInt(req.body.status),
            /* publish_date: req.body.publish_date, */
        };
        //console.log(payload);

        let array_errors_schema_validator:string[] = [];
        try {
            const value = await schemaValidateRegister.validateAsync(payload, { abortEarly: false });
        } catch (error:Error | any) {
            //console.log(error.details);
            error.details.forEach((error_detail:any) => {
                array_errors_schema_validator.push(error_detail.message)
            });
            res.status(400)
            res.json({error: array_errors_schema_validator! }); 
            return;
        }

        
        let files = req.files as { [ fieldname:string ]: Express.Multer.File[] };
        let image_name: string | null = null;

        try {
            // VALIDACIÓN FILE IMG
            if(files == undefined || files['img_url_blob'] == null){
                res.status(400)
                res.json({ error: ["No se puede registrar la Noticia sin subir ninguna Imagen."] });
                return;
            }
            // VALIDACIÓN PESO FILE IMG
            let peso_img_url_blob:number = files['img_url_blob'][0].size;
            let peso_max_img_url_blob:number = 15*1024*1024; // 15Mb
            if(peso_img_url_blob > peso_max_img_url_blob){
                res.status(400)
                res.json({ error: ["El peso de la Imagen cargada no debe superar los 15 Mb."] });
                return;
            }

            image_name = files['img_url_blob'].length > 0 ? files['img_url_blob'][0].path : null;
        } catch (error:Error | any) {
            /* console.log("Error uploading files");
            console.log(error);*/
            res.status(400)
            res.json({ error: [ "Se verifico un error intentando subir la imagen." ] });
            return;
        }
        
        let newsJSON = req.body as {
            titulo: string,
            subtitulo: string,
            seo_url: string,
            img_url: string,
            keywords: string,
            status: string,
            publish_date: Date,
            news_content: NewsContent[],
        };

        let news: News = {
            id: 0,
            titulo: newsJSON.titulo,
            subtitulo: newsJSON.subtitulo,
            seo_url: seo_url_parseado,
            img_url: image_name ?? '',
            keywords: newsJSON.keywords,
            status: newsJSON.status === "1" ? true : false,
            publish_date: new Date(newsJSON.publish_date)/* .toDateString() */,
            created_at: new Date(),
            updated_at: new Date(),
            news_content: []
        }

        let newNews = null;
        try {
            newNews = await this.newsUC.register(news)
            if (newNews == null) {
                res.status(400)
                res.json( { error : ["No se pudo registrar la Noticia"]} )
                return;
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo registrar la Noticia, intente de nuevo." ] }); 
            return;
        }

        res.json({message: "Se ha registrado la Noticia exitosamente.", data: newNews/* , id: newNews.id */ });        
    }
    async update (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        let id_to_update = parseInt(req.params.id);
        if (id_to_update == undefined || typeof id_to_update != "number") {
            res.status(400)
            res.json( { error : ["El id debe ser un valor numérico."] } )
            return
        }

        // Parsing Seo_Url
        let seo_url_parseado:string = await this.parsingSeoUrl(req.body.seo_url);

        const payload = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            seo_url: seo_url_parseado,
            keywords: req.body.keywords,
            status: parseInt(req.body.status),
            /* publish_date: req.body.publish_date, */
        };
        //console.log(payload);
        
        
        let array_errors_schema_validator:string[] = [];
        try {
            const value = await schemaValidateRegister.validateAsync(payload, { abortEarly: false });
        } catch (error:Error | any) {
            //console.log(error.details);
            error.details.forEach((error_detail:any) => {
                array_errors_schema_validator.push(error_detail.message)
            });
            res.status(400)
            res.json({error: array_errors_schema_validator! }); 
            return;
        }

        let files = req.files as { [ fieldname:string ]: Express.Multer.File[] };
        let image_name: string | null = null;

        try {
            // VALIDACIÓN FILE IMG
            if(files != undefined){
                if(files['img_url_blob'] != undefined && files['img_url_blob'] != null){
                    // VALIDACIÓN PESO FILE IMG
                    let peso_img_url_blob:number = files['img_url_blob'][0].size;
                    let peso_max_img_url_blob:number = 15*1024*1024; // 15Mb
                    if(peso_img_url_blob > peso_max_img_url_blob){
                        res.status(400)
                        res.json({ error: ["El peso de la Imagen cargada no debe superar los 15 Mb."] });
                        return;
                    }
                    image_name = files['img_url_blob'].length > 0 ? files['img_url_blob'][0].path : null;
                }
            }
        } catch (error:Error | any) {
            /* console.log("Error uploading files");
            console.log(error);*/
            res.status(400)
            res.json({ error: [ "Se verifico un error intentando subir la imagen." ] });
            return;
        }

        let newsJSON = req.body as {
            titulo: string,
            subtitulo: string,
            seo_url: string,
            img_url: string,
            keywords: string,
            status: string,
            publish_date: Date,
            created_at: string,
            updated_at: string,
            news_content: NewsContent[],
        };

        let news: News = {
            id: id_to_update,
            titulo: newsJSON.titulo,
            subtitulo: newsJSON.subtitulo,
            seo_url: seo_url_parseado,
            img_url: image_name === null ? '' : image_name,
            keywords: newsJSON.keywords,
            status: newsJSON.status === "1" ? true : false,
            publish_date: new Date(newsJSON.publish_date),
            created_at: new Date(),
            updated_at: new Date(),
            news_content: []
        }

        // Controlador que indica que la imagen cargada en la petición no es nueva, es la misma que ya esta en public pero esta se manda
        // solo cropeada para que no se muestre el error del verifyFileExists
        let img_url_old_cropped:boolean = false;
        if(req.body.img_url_old_cropped !== undefined && req.body.img_url_old_cropped !== null) {
            img_url_old_cropped = req.body.img_url_old_cropped === 'true' ? true : false;
        }
        
        let updatedNews = null;
        try {
            updatedNews = await this.newsUC.update(news, img_url_old_cropped)
            if (updatedNews == null) {
                res.status(400)
                res.json( { error : ["No se pudo actualizar la Noticia."] } )
                return;
            }
        } catch (error:Error | any) {
            //console.log(error);
            res.status(400)
            res.json({  error: [ error.message ?? "No se pudo actualizar la Noticia, intente de nuevo." ] }); 
            return;
        } 

        res.json({ message: "Se ha actualizado la Noticia exitosamente.", data: updatedNews });
    }
    async delete (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( { error : ["El id debe ser un valor numérico"] } )
            return
        }

        let newNews = null;
        try {
            newNews = await this.newsUC.delete(id)
            if (newNews == null) {
                res.status(400)
                res.json( { error : [ "Error al buscar la Noticia a eliminar o Noticia no encontrado." ] } )
                return
            }
        } catch (error:Error | any) {
            //console.log(error);
            res.status(400)
            res.json({ error: [ error.message ?? "Error al buscar la Noticia a eliminar o Noticia no encontrado." ] }); 
            return;
        }
        res.json({ message: "Se ha eliminado la Noticia exitosamente." });
    }

}