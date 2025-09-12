import { NewsRepository } from "../../domain/news"
import { NewsContent, NewsContentAdminUsecase, NewsContentRepository } from "../../domain/news_content";
import fs from 'fs'
import mv from 'mv'
import util from 'util'
import Os from 'os'

const mvPromise = util.promisify(
    (source: string, dest: string, cb : (err?: any) => void) => mv(
        source,
        dest,
        { mkdirp: true },
        (err) => cb(err)
    )
);

const ruta_imagen:string = __dirname.replace("src\\news_content\\usecase", "").replace("src/news_content/usecase", "") + ( Os.platform() === "linux" ? "public/news_content/img/" : "public\\news_content\\img\\");
const ruta_audio:string = __dirname.replace("src\\news_content\\usecase", "").replace("src/news_content/usecase", "") + ( Os.platform() === "linux" ? "public/news_content/audio/" : "public\\news_content\\audio\\");
const ruta_video:string = __dirname.replace("src\\news_content\\usecase", "").replace("src/news_content/usecase", "") + ( Os.platform() === "linux" ? "public/news_content/video/" : "public\\news_content\\video\\");


export class NewsContentCRUDUC implements NewsContentAdminUsecase {
    newsRepo: NewsRepository;
    newsContentRepo: NewsContentRepository

    constructor(newsRepo: NewsRepository, newsContentRepo: NewsContentRepository) {
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
    }

    async listByNewsId(news_id_to_list:number) : Promise<NewsContent[]> {
        return await this.newsContentRepo.listByNewsId(news_id_to_list);
    }
    async byID(id: number) : Promise<NewsContent | null> {
        let news_content = await this.newsContentRepo.byID(id)
        if (news_content == null) {
            throw new Error("No se encontró el Componente de la Noticia.");
        }
        
        return news_content
    }
    async register(news_content: NewsContent) : Promise<NewsContent | null> {

        if(news_content.tipo === 2 && news_content.contenido !== ''){
            // registro de imagen
            let ruta_to_save:string = "";
            let img_url_aux:string = "";
            if (news_content.contenido !== '') {
                let verify_result:string[] = [];
                try {
                    // Envio como tercer parametro el false porque en registrar no debo verificar si es una imagen cropeada ya subida al servidor
                    verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                } catch (error:Error | any) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                img_url_aux = news_content.contenido;
                news_content.contenido = verify_result[1]; // originalname_aux
            }
            
            try {
                // Se mueve la imagen solo despues de que se validó de forma definiva
                //fs.renameSync(img_url_aux, ruta_to_save);
                await mvPromise(img_url_aux, ruta_to_save);
            } catch (error:Error | any) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar la Imagen del Componente, error interno.");
            }
        }
        
        if(news_content.tipo === 3 && news_content.contenido !== ''){
            // registro de Video
            let ruta_to_save:string = "";
            let video_url_aux:string = "";
            if (news_content.contenido !== '') {
                let verify_result:string[] = [];
                try {
                    // Envio como tercer parametro el false porque en registrar no debo verificar si es una imagen cropeada ya subida al servidor
                    verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                } catch (error:Error | any) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                video_url_aux = news_content.contenido;
                news_content.contenido = verify_result[1]; // originalname_aux
            }
            
            try {
                // Se mueve la imagen solo despues de que se validó de forma definiva
                //fs.renameSync(video_url_aux, ruta_to_save);
                await mvPromise(video_url_aux, ruta_to_save);
            } catch (error:Error | any) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar el Video del Componente, error interno.");
            }
        }

        if(news_content.tipo === 4 && news_content.contenido !== ''){
            // registro de Audio
            let ruta_to_save:string = "";
            let audio_url_aux:string = "";
            if (news_content.contenido !== '') {
                let verify_result:string[] = [];
                try {
                    // Envio como tercer parametro el false porque en registrar no debo verificar si es una imagen cropeada ya subida al servidor
                    verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                } catch (error:Error | any) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                audio_url_aux = news_content.contenido;
                news_content.contenido = verify_result[1]; // originalname_aux
            }
            
            try {
                // Se mueve la imagen solo despues de que se validó de forma definiva
                //fs.renameSync(audio_url_aux, ruta_to_save);
                await mvPromise(audio_url_aux, ruta_to_save);
            } catch (error:Error | any) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar el Audio del Componente, error interno.");
            }
        }
        
        return await this.newsContentRepo.register(news_content, news_content.news_id)

    }
    async update(news_content: NewsContent, img_url_old_cropped:boolean) : Promise<NewsContent | null> {
        let news_content_DB = await this.newsContentRepo.byID(news_content.id)
        if (news_content_DB == null) {
            throw new Error("No se encontró la Noticia");
        }

        if(news_content.tipo === 2){
            // registro de imagen
            let ruta_to_save:string = "";
            let img_url_aux:string = "";
            // Primero reviso que sea diferente de vacio
            if (news_content.contenido !== '' && news_content.contenido !== undefined && news_content.contenido !== null) {
                let verify_result:string[] = [];
                try {
                    // Envio contenido, tipo para el mensaje de error y el verificador de imagen ya subida en el servidor cropeada.
                    verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, img_url_old_cropped);
                } catch (error:Error | any) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                img_url_aux = news_content.contenido;
                news_content.contenido = verify_result[1]; // originalname_aux
                if(news_content_DB.contenido !== '' && news_content_DB.contenido !== null && news_content_DB.contenido !== undefined){
                    try {
                        this.deleteOldFileOnUpdate(news_content_DB.contenido, news_content_DB.tipo); // envio url de la imagen vieja a reemplazar pa que se elimine
                    } catch (error:Error | any) {
                        console.error(error);
                        // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                        throw new Error(error.message);
                    }
                }
            }

            try {
                // Se mueven la imagen solo despues de que se validó de forma definiva
                if(img_url_aux != "" && ruta_to_save != ""){
                    //fs.renameSync(img_url_aux, ruta_to_save);
                    await mvPromise(img_url_aux, ruta_to_save);
                }
            } catch (error:Error | any) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar la Imagen del Componente, error interno.");
            }
        }

        if(news_content.tipo === 3 && news_content.contenido !== ''){
            // registro de Video
            let ruta_to_save:string = "";
            let video_url_aux:string = "";
            if (news_content.contenido !== '') {
                let verify_result:string[] = [];
                try {
                    verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                } catch (error:Error | any) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                video_url_aux = news_content.contenido;
                news_content.contenido = verify_result[1]; // originalname_aux

                if(news_content_DB.contenido !== '' && news_content_DB.contenido !== null && news_content_DB.contenido !== undefined){
                    try {
                        this.deleteOldFileOnUpdate(news_content_DB.contenido, news_content_DB.tipo); // envio url de la imagen vieja a reemplazar pa que se elimine
                    } catch (error:Error | any) {
                        console.error(error);
                        // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                        throw new Error(error.message);
                    }
                }
            }
            
            try {
                // Se mueven la imagen solo despues de que se validó de forma definiva
                if(video_url_aux != "" && ruta_to_save != ""){
                    //fs.renameSync(img_url_aux, ruta_to_save);
                    await mvPromise(video_url_aux, ruta_to_save);
                }
            } catch (error:Error | any) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar el Video del Componente, error interno.");
            }
        }

        if(news_content.tipo === 4 && news_content.contenido !== ''){
            // registro de Audio
            let ruta_to_save:string = "";
            let audio_url_aux:string = "";
            if (news_content.contenido !== '') {
                let verify_result:string[] = [];
                try {
                    verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                } catch (error:Error | any) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                audio_url_aux = news_content.contenido;
                news_content.contenido = verify_result[1]; // originalname_aux

                if(news_content_DB.contenido !== '' && news_content_DB.contenido !== null && news_content_DB.contenido !== undefined){
                    try {
                        this.deleteOldFileOnUpdate(news_content_DB.contenido, news_content_DB.tipo); // envio url de la imagen vieja a reemplazar pa que se elimine
                    } catch (error:Error | any) {
                        console.error(error);
                        // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                        throw new Error(error.message);
                    }
                }
            }

            try {
                // Se mueven la imagen solo despues de que se validó de forma definiva
                if(audio_url_aux != "" && ruta_to_save != ""){
                    //fs.renameSync(img_url_aux, ruta_to_save);
                    await mvPromise(audio_url_aux, ruta_to_save);
                }
            } catch (error:Error | any) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar el Audio del Componente, error interno.");
            }
        }

        // Puede que no se haya enviado la imagen para reemplazar la anterior, en dicho caso sus valores seguirian en undefined
        // en tal caso se actualizará el registro con el nombre anterior
        if(news_content.contenido == undefined || news_content.contenido == null || news_content.contenido == "") {
            if(news_content.tipo < 2  && news_content.tipo > 4) {
                news_content.contenido = "";
            } else {
                news_content.contenido = news_content_DB.contenido;
            }
        }

        return await this.newsContentRepo.update(news_content)
    }
    async delete(news_content_id_to_delete: number) : Promise<boolean> {
        try {
            let newsToDelete = this.newsContentRepo.byID(news_content_id_to_delete)
            if (newsToDelete === null) {
                throw new Error("Componente de la Noticia no encontrado.");
            }
        } catch (error:Error | any) {
            throw new Error(error.message ?? "Error al buscar el Componente de la Noticia a eliminar o Componente no encontrado.");
        }

        try {
            await this.deletePhotoAudioVideoNewsContent(news_content_id_to_delete);
        } catch (error:Error | any) {
            throw new Error(error.message ?? "No se pudo eliminar los archivos del Componente de la Noticia, error interno.");
        }

        return await this.newsContentRepo.delete(news_content_id_to_delete)
    }

    async deletePhotoAudioVideoNewsContent(news_content_id_to_delete: number) : Promise<void>{
        const foundRows = await this.newsContentRepo.byID(news_content_id_to_delete);
        
        try {
            if(foundRows?.tipo === 2 && (foundRows?.contenido != null && foundRows?.contenido != "")){
                if (!fs.existsSync(ruta_imagen + foundRows?.contenido)) {
                    return;
                }
                fs.unlinkSync(ruta_imagen + foundRows?.contenido);
            }
            if(foundRows?.tipo === 3 && (foundRows?.contenido != null && foundRows?.contenido != "")){
                if (!fs.existsSync(ruta_video + foundRows?.contenido)) {
                    return;
                }
                fs.unlinkSync(ruta_video + foundRows?.contenido);
            }
            if(foundRows?.tipo === 4 && (foundRows?.contenido != null && foundRows?.contenido != "")){
                if (!fs.existsSync(ruta_audio + foundRows?.contenido)) {
                    return;
                }
                fs.unlinkSync(ruta_audio + foundRows?.contenido);
            }
        } catch (error:Error | any) {
            console.log("Error deleting old file");
            console.log(error);
            throw new Error("No se pudo eliminar los archivos del Componente de la Noticia, error interno");
        }
    }

    verifyFileExists(new_image: string, tipo_file: number, img_url_old_cropped:boolean) : string[]{
        let originalname_aux:string = "";
        let array_string:string[] = [];

        if(new_image.includes('/')){
            // linux
            array_string = new_image.split("/");
            originalname_aux = array_string[array_string.length -1];
        } else {
            // windows
            array_string = new_image.split("\\");
            originalname_aux = array_string[array_string.length -1];
        }
        //console.log(originalname_aux);
        originalname_aux = originalname_aux.trim()
                            .toLowerCase()
                            .replace(/ /g, '_')
                            .replace(/ +/g, '-')
                            .replace(/á/g, 'a')
                            .replace(/é/g, 'e')
                            .replace(/í/g, 'i')
                            .replace(/ó/g, 'o')
                            .replace(/ú/g, 'u')
                            .replace(/ñ/g, 'n')
                            .replace(/[^a-z0-9-_.]/g, '');
        
        // Obtengo la ruta pa verificar si mi archivo ya existe
        let ruta_to_verify:string = "";
        if(tipo_file == 2){ // IMG
            ruta_to_verify = ruta_imagen + originalname_aux;
            if (fs.existsSync(ruta_to_verify) && !img_url_old_cropped) {
                throw new Error("El nombre de la Imagen ya se encuentra en uso, cambie el nombre y vuelva a subirla.");
            }
        }
        if(tipo_file == 3){ // VIDEO
            ruta_to_verify = ruta_video + originalname_aux;
            if (fs.existsSync(ruta_to_verify)) {
                throw new Error("El nombre del Video ya se encuentra en uso, cambie el nombre y vuelvalo a subir.");
            }
        }
        if(tipo_file == 4){ // AUDIO
            ruta_to_verify = ruta_audio + originalname_aux;
            if (fs.existsSync(ruta_to_verify)) {
                throw new Error("El nombre del Audio ya se encuentra en uso, cambie el nombre y vuelvalo a subir.");
            }
        }
        return [ruta_to_verify, originalname_aux];
    }

    deleteOldFileOnUpdate(old_image: string, tipo_file:number) : void{
        // Si guardo la foto nueva entonces debo eliminar la anterior que obtengo mediante podcastDB
        let ruta_file_to_delete:string = "";
        if(tipo_file == 2){ // IMG
            ruta_file_to_delete = ruta_imagen + old_image;
        }
        if(tipo_file == 3){ // VIDEO
            ruta_file_to_delete = ruta_video + old_image;
        }
        if(tipo_file == 4){ // AUDIO
            ruta_file_to_delete = ruta_audio + old_image;
        }

        try {
            if (!fs.existsSync(ruta_file_to_delete)) {
                return;
            }

            fs.unlinkSync(ruta_file_to_delete);
        } catch (error:Error | any) {
            console.log("Error deleting old file");
            console.log(error);
            
            if(tipo_file == 2){ // IMG
                throw new Error("No se pudo eliminar la Imagen Anterior que se esta intentado reemplazar.");
            }
            if(tipo_file == 3){ // VIDEO
                throw new Error("No se pudo eliminar el Video Anterior que se esta intentado reemplazar.");
            }
            if(tipo_file == 4){ // AUDIO
                throw new Error("No se pudo eliminar el Audio Anterior que se esta intentado reemplazar.");
            }
        }
    }
}