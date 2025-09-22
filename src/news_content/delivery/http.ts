import { NewsContent, NewsContentAdminUsecase } from './../../domain/news_content';
import { Router, Request, Response } from "express"
//import { News, NewsUsecase } from "../../domain/news"

import { UserUsecase } from "../../domain/user"

import { MulterError } from "multer"

import uploadImagenAudioVideoNewsContent from "./multer/uploadImages"
import schemaValidateRegister from "./joi_validator/schemaRegister"
import schemaValidateUpdate from "./joi_validator/schemaUpdate"


export class NewsContentHandler {
    newsContentUC: NewsContentAdminUsecase;
    userUC: UserUsecase;

    constructor(newsContentUC: NewsContentAdminUsecase, userUC: UserUsecase) {
        this.newsContentUC = newsContentUC;
        this.userUC = userUC;
    }

    init(apiInstance: Router) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/list_by_news/:news_id', async (req, res) => this.listByNewsId(req,res));
        subRouter.get('/by_id/:news_content_id', async (req, res) => this.byID(req,res));

        subRouter.post('/register/:news_id', async (req, res) => {
            uploadImagenAudioVideoNewsContent(req, res, (err:any) => {
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
        subRouter.put('/update/:news_content_id', async (req, res) => {
            uploadImagenAudioVideoNewsContent(req, res, (err:any) => {
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
        subRouter.delete('/delete/:news_content_id', async (req, res) => this.delete(req,res));

        apiInstance.use('/news_content', subRouter)
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

    async listByNewsId (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        if(req.params.news_id == undefined) {
            res.status(400)
            res.json( { error : ["El ID de la Noticia debe ser un valor numérico."] } )
            return
        }
        let news_id_to_list:number = (typeof req.params.news_id === 'string') ? parseInt(req.params.news_id) : req.params.news_id;

        let news_content_res = await this.newsContentUC.listByNewsId(news_id_to_list);
        res.json( news_content_res );
    }
    async byID (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }
        
        if(req.params.news_content_id == undefined) {
            res.status(400)
            res.json( { error : ["El ID del Componente de la Noticia debe ser un valor numérico."] } )
            return
        }
        let id_to_search:number = (typeof req.params.news_content_id === 'string') ? parseInt(req.params.news_content_id) : req.params.news_content_id;

        let news_content_res = null;
        try {
            news_content_res = await this.newsContentUC.byID(id_to_search);

            if (news_content_res == null) {
                res.status(400)
                res.json( { error : ["No se encontró el Componente de la Noticia."] } )
                return;
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se encontró el Componente de la Noticia." ] }); 
            return;
        }
        res.json( news_content_res );
    }
    async register (req: Request,  res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        if(req.params.news_id == undefined) {
            res.status(400)
            res.json( { error : ["El ID de la Noticia debe ser un valor numérico."] } )
            return
        }
        let news_id_to_register:number = (typeof req.params.news_id === 'string') ? parseInt(req.params.news_id) : req.params.news_id;

        const payload = {
            position: req.body.position,
            tipo: req.body.tipo,
            /* descripcion: req.body.descripcion, */
            news_id: news_id_to_register,
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

        let newsContentJSON = req.body as {
            position: string,
            tipo: string,
            contenido: string,
            descripcion: string,
            /* news_id: number, */
        };
        
        let files = req.files as { [ fieldname:string ]: Express.Multer.File[] };
        let contenido_content_name: string | null = null;

        try {
            // VALIDACIÓN FILE
            // Si mi tipo de recurso es 2 (img), 3 (video) o 4 (audio) &&
            switch(newsContentJSON.tipo){
                case "1": //{ value: 1, label: 'Texto' },
                    // Al ser texto simple se lo pasa sin conversiones ni nada, este puede llegar vació
                    contenido_content_name = newsContentJSON.contenido
                    break;
                case "2": //{ value: 2, label: 'Imagen' },
                    // Si no se envia una file entonces se deja vacio el contenido
                    if(files == undefined || files['img_url_blob'] == null || files['img_url_blob'][0] == undefined){
                        contenido_content_name = "";
                    } else {
                        // VALIDACIÓN PESO FILE IMG
                        let peso_img_url_blob:number = files['img_url_blob'][0].size;
                        let peso_max_img_url_blob:number = 15*1024*1024; // 15Mb
                        if(peso_img_url_blob > peso_max_img_url_blob){
                            res.status(400)
                            res.json({ error: ["El peso de la Imagen cargada no debe superar los 15 Mb."] });
                            return;
                        }
                        contenido_content_name = files['img_url_blob'].length > 0 ? files['img_url_blob'][0].path : null;
                    }
                    break;
                case "3": //{ value: 3, label: 'Video' },
                    // Si no se envia una file entonces se deja vacio el contenido
                    if(files == undefined || files['video_url_blob'] == null || files['video_url_blob'][0] == undefined){
                        contenido_content_name = "";
                    } else {
                        // VALIDACIÓN PESO FILE VIDEO
                        let peso_video_url_blob:number = files['video_url_blob'][0].size;
                        let peso_max_video_url_blob:number = 20*1024*1024; // 20Mb
                        if(peso_video_url_blob > peso_max_video_url_blob){
                            res.status(400)
                            res.json({ error: ["El peso del Video cargado no debe superar los 20 Mb."] });
                            return;
                        }
                        contenido_content_name = files['video_url_blob'].length > 0 ? files['video_url_blob'][0].path : null;
                    }
                    break;
                case "4": //{ value: 4, label: 'Sonido' },
                    // Si no se envia una file entonces se deja vacio el contenido
                    if(files == undefined || files['audio_url_blob'] == null || files['audio_url_blob'][0] == undefined){
                        contenido_content_name = "";
                    } else {
                        // VALIDACIÓN PESO FILE AUDIO
                        let peso_audio_url_blob:number = files['audio_url_blob'][0].size;
                        let peso_max_audio_url_blob:number = 10*1024*1024; // 10Mb
                        if(peso_audio_url_blob > peso_max_audio_url_blob){
                            res.status(400)
                            res.json({ error: ["El peso del Audio cargado no debe superar los 10 Mb."] });
                            return;
                        }
                        contenido_content_name = files['audio_url_blob'].length > 0 ? files['audio_url_blob'][0].path : null;
                    }
                    break;
                case "5": //{ value: 5, label: 'IFrame Integrado' },
                    // Al ser texto simple se lo pasa sin conversiones ni nada, este puede llegar vació
                    contenido_content_name = newsContentJSON.contenido
                    break;
            }
        } catch (error:Error | any) {
            /* console.log("Error uploading files");
            console.log(error);*/
            res.status(400)
            res.json({ error: [ "Se verifico un error intentando subir los archivos." ] });
            return;
        }
        
        let news_content: NewsContent = {
            id: 0,
            position: parseInt(newsContentJSON.position),
            tipo: parseInt(newsContentJSON.tipo),
            contenido: (contenido_content_name === null || contenido_content_name === '') ? '' : contenido_content_name,
            descripcion: (newsContentJSON.descripcion === null || newsContentJSON.descripcion === '') ? '' : newsContentJSON.descripcion,
            news_id: news_id_to_register,
            created_at: new Date(),
            updated_at: new Date(),
        }
        
        let newNewsContent = null;
        try {
            newNewsContent = await this.newsContentUC.register(news_content, news_id_to_register)
            if (newNewsContent == null) {
                res.status(400)
                res.json( { error : [ "No se pudo registrar el Componente de la Noticia." ] } )
                return;
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo registrar el Componente de la Noticia, intente de nuevo." ] }); 
            return;
        }

        res.json({message: "Se ha registrado el Componente de la Noticia exitosamente.", data: newNewsContent });
    }
    async update (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        if(req.params.news_content_id == undefined) {
            res.status(400)
            res.json( { error : ["El ID del Componente de la Noticia debe ser un valor numérico."] } )
            return
        }
        let news_content_id_to_update:number = (typeof req.params.news_content_id === 'string') ? parseInt(req.params.news_content_id) : req.params.news_content_id;
        
        // Validación cambio Tipo Componente de la Noticia
        let news_content_DB = null;
        try {
            news_content_DB = await this.newsContentUC.byID(news_content_id_to_update)
            if (news_content_DB == null) {
                res.status(400)
                res.json({ error: ["No se encontró el Componente de la Noticia que se esta intentando actualizar."] }); 
                return;
            }
            
            // Si ya hay datos en descripción y contenido no se debe permitir cambiar el tipo de News Content
            if (
                news_content_DB.tipo !== parseInt(req.body.tipo) && 
                (
                    (news_content_DB.contenido === req.body.contenido) &&
                    (news_content_DB.contenido !== null && news_content_DB.contenido !== "")
                )
            ) {
                res.status(400)
                res.json({error: ["No se puede cambiar el Tipo de este Registro ya que posee contenido y descripción."] }); 
                return;
            }
        } catch (error:Error | any) {
            res.status(400)
            res.json({ error: ["No se pudo comprobar si es factible el cambio del tipo de Componente, intente más tarde."] }); 
            return;
        }
        

        const payload = {
            position: req.body.position,
            tipo: req.body.tipo,
            /* descripcion: req.body.descripcion,
            news_id: req.body.news_id, */
        };
        //console.log(payload);
        
        
        let array_errors_schema_validator:string[] = [];
        try {
            const value = await schemaValidateUpdate.validateAsync(payload, { abortEarly: false });
        } catch (error:Error | any) {
            //console.log(error.details);
            error.details.forEach((error_detail:any) => {
                array_errors_schema_validator.push(error_detail.message)
            });
            res.status(400)
            res.json({error: array_errors_schema_validator! }); 
            return;
        }


        let newsContentJSON = req.body as {
            position: string,
            tipo: string,
            contenido: string,
            descripcion: string,
            news_id: number,
        };

        let files = req.files as { [ fieldname:string ]: Express.Multer.File[] };
        let contenido_content_name: string | null = null;

        try {
            // VALIDACIÓN FILE
            // Si mi tipo de recurso es 2 (img), 3 (video) o 4 (audio) &&
            switch(newsContentJSON.tipo){
                case "1": //{ value: 1, label: 'Texto' },
                    // Al ser texto simple se lo pasa sin conversiones ni nada, este puede llegar vació
                    contenido_content_name = newsContentJSON.contenido
                    break;
                case "2": //{ value: 2, label: 'Imagen' },
                    // Si no se envia una file entonces se deja vacio el contenido
                    if(files == undefined || files['img_url_blob'] == null || files['img_url_blob'][0] == undefined){
                        contenido_content_name = "";
                    } else {
                        // VALIDACIÓN PESO FILE IMG
                        let peso_img_url_blob:number = files['img_url_blob'][0].size;
                        let peso_max_img_url_blob:number = 15*1024*1024; // 15Mb
                        if(peso_img_url_blob > peso_max_img_url_blob){
                            res.status(400)
                            res.json({ error: ["El peso de la Imagen cargada no debe superar los 15 Mb."] });
                            return;
                        }
                        contenido_content_name = files['img_url_blob'].length > 0 ? files['img_url_blob'][0].path : null;
                    }
                    break;
                case "3": //{ value: 3, label: 'Video' },
                    // Si no se envia una file entonces se deja vacio el contenido
                    if(files == undefined || files['video_url_blob'] == null || files['video_url_blob'][0] == undefined){
                        contenido_content_name = "";
                    } else {
                        // VALIDACIÓN PESO FILE VIDEO
                        let peso_video_url_blob:number = files['video_url_blob'][0].size;
                        let peso_max_video_url_blob:number = 20*1024*1024; // 20Mb
                        if(peso_video_url_blob > peso_max_video_url_blob){
                            res.status(400)
                            res.json({ error: ["El peso del Video cargado no debe superar los 20 Mb."] });
                            return;
                        }
                        contenido_content_name = files['video_url_blob'].length > 0 ? files['video_url_blob'][0].path : null;
                    }
                    break;
                case "4": //{ value: 4, label: 'Sonido' },
                    // Si no se envia una file entonces se deja vacio el contenido
                    if(files == undefined || files['audio_url_blob'] == null || files['audio_url_blob'][0] == undefined){
                        contenido_content_name = "";
                    } else {
                        // VALIDACIÓN PESO FILE AUDIO
                        let peso_audio_url_blob:number = files['audio_url_blob'][0].size;
                        let peso_max_audio_url_blob:number = 10*1024*1024; // 10Mb
                        if(peso_audio_url_blob > peso_max_audio_url_blob){
                            res.status(400)
                            res.json({ error: ["El peso del Audio cargado no debe superar los 10 Mb."] });
                            return;
                        }
                        contenido_content_name = files['audio_url_blob'].length > 0 ? files['audio_url_blob'][0].path : null;
                    }
                    break;
                case "5": //{ value: 5, label: 'IFrame Integrado' },
                    // Al ser texto simple se lo pasa sin conversiones ni nada, este puede llegar vació
                    contenido_content_name = newsContentJSON.contenido
                    break;
            }
        } catch (error:Error | any) {
            /* console.log("Error uploading files");
            console.log(error);*/
            res.status(400)
            res.json({ error: [ "Se verifico un error intentando subir los archivos." ] });
            return;
        }

        let news_content: NewsContent = {
            id: news_content_id_to_update,
            position: parseInt(newsContentJSON.position),
            tipo: parseInt(newsContentJSON.tipo),
            contenido: contenido_content_name === null ? '' : contenido_content_name,
            descripcion: newsContentJSON.descripcion ?? '',
            news_id: newsContentJSON.news_id,
            created_at: new Date(),
            updated_at: new Date(),
        }

        // Controlador que indica que la imagen cargada en la petición no es nueva, es la misma que ya esta en public pero esta se manda
        // solo cropeada para que no se muestre el error del verifyFileExists
        let img_url_old_cropped:boolean = false;
        if(req.body.img_url_old_cropped !== undefined && req.body.img_url_old_cropped !== null) {
            img_url_old_cropped = req.body.img_url_old_cropped === 'true' ? true : false;
        }

        let updatedNewsContent = null;
        try {
            updatedNewsContent = await this.newsContentUC.update(news_content, img_url_old_cropped)
            if (updatedNewsContent == null) {
                res.status(400)
                res.json( { error : ["No se pudo actualizar el Componente de la Noticia."] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            
            res.status(400)
            res.json({error: error.message! }); 
            return;
        }

        res.json({message: "Se ha actualizado el Componente de la Noticia exitosamente.", data: updatedNewsContent });
    }
    async delete (req: Request, res: Response) {
        let isAuthenticated = await this.verifyAuth(req, res);
        if (!isAuthenticated) {
            return;
        }

        if(req.params.news_content_id == undefined) {
            res.status(400)
            res.json( { error : ["El ID del Componente de la Noticia debe ser un valor numérico."] } )
            return
        }
        let news_content_id_to_delete:number = (typeof req.params.news_content_id === 'string') ? parseInt(req.params.news_content_id) : req.params.news_content_id;

        let deletedNewsContent = null;
        try {
            deletedNewsContent = await this.newsContentUC.delete(news_content_id_to_delete)
            if (deletedNewsContent == null) {
                res.status(400)
                res.json( { error : [ "Error al buscar el Componente de la Noticia a eliminar o Componente no encontrado." ] } )
                return
            }
        } catch (error:Error | any) {
            //console.log(error);
            res.status(400)
            res.json({ error: [ error.message ?? "Error al buscar el Componente de la Noticia a eliminar o Componente no encontrado." ] }); 
            return;
        }

        res.json({ message: "Se ha eliminado el Componente de la Noticia exitosamente." });
    }

}