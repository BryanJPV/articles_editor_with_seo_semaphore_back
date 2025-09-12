import { News, NewsAdminUsecase, NewsRepository } from "../../domain/news"
import { NewsContentRepository } from "../../domain/news_content";
import { PodcastRepository } from "../../domain/podcasts"
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

const ruta_imagen:string = __dirname.replace("src\\news\\usecase", "").replace("src/news/usecase", "") + ( Os.platform() === "linux" ? "public/news/img/" : "public\\news\\img\\");

export class NewsCRUDUC implements NewsAdminUsecase {
    newsRepo: NewsRepository;
    newsContentRepo: NewsContentRepository;
    podcastRepo: PodcastRepository;

    constructor(newsRepo: NewsRepository, newsContentRepo: NewsContentRepository, podcastRepo: PodcastRepository) {
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
        this.podcastRepo = podcastRepo;
    }

    async list() : Promise<News[]> {
        let newsList = await this.newsRepo.listAdmin();

        for (let index = 0; index < newsList.length; index++) {
            let newsContentList = await this.newsContentRepo.listByNewsId(newsList[index].id);
            newsList[index].news_content = newsContentList;
        }

        return newsList //await this.newsRepo.list()
    }
    async byID(id: number) : Promise<News | null> {
        let news = await this.newsRepo.byIDAdmin(id)
        if (news == null) {
            throw new Error("No se encontró la Noticia.");
        }
        news.news_content = await this.newsContentRepo.listByNewsId(news.id);
        return news
    }
    async register(news: News) : Promise<News | null> {
        if(await this.newsRepo.existSeoUrl(news.seo_url, 0)){
            throw new Error("El Seo Url ingresado ya existe, cambielo.");
        }

        // registro de imagen
        let ruta_to_save:string = "";
        let img_url_aux:string = "";
        if (news.img_url !== '') {let verify_result:string[] = [];
            try {
                // Envio false como img_url_old_cropped:boolean porque solo se debería verificar su uso en Update
                verify_result = this.verifyFileExists(news.img_url, false);
            } catch (error:Error | any) {
                console.error(error);
                // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                throw new Error(error.message);
            }
            ruta_to_save = verify_result[0]; // ruta_to_verify
            img_url_aux = news.img_url;
            news.img_url = verify_result[1]; // originalname_aux
        }

        try {
            // Se mueve la imagen solo despues de que se validó de forma definiva
            //fs.renameSync(img_url_aux, ruta_to_save);
            await mvPromise(img_url_aux, ruta_to_save);
        } catch (error:Error | any) {
            console.log("Error copying file");
            console.error(error);
            throw new Error("No se pudo almacenar la Imagen de Portada, error interno.");
        }
        
        return await this.newsRepo.register(news)

    }
    async update(news: News, img_url_old_cropped:boolean) : Promise<News | null> {
        let newsDB = await this.newsRepo.byIDAdmin(news.id)
        if (newsDB == null) {
            throw new Error("No se encontró la Noticia");
        }

        if(await this.newsRepo.existSeoUrl(news.seo_url, news.id)){
            throw new Error("El Seo Url ingresado ya existe, cambielo.");
        }
        
        // Verifico que el archivo ya exista
        // registro de imagen
        let ruta_to_save:string = "";
        let img_url_aux:string = "";
        // Primero reviso que sea diferente de vacio
        if (news.img_url !== '' && news.img_url !== undefined && news.img_url !== null) {
            let verify_result:string[] = [];
            try {
                verify_result = this.verifyFileExists(news.img_url, img_url_old_cropped);
            } catch (error:Error | any) {
                console.error(error);
                // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                throw new Error(error.message);
            }
            ruta_to_save = verify_result[0]; // ruta_to_verify
            img_url_aux = news.img_url;
            news.img_url = verify_result[1]; // originalname_aux

            try {
                this.deleteOldFileOnUpdate(newsDB.img_url); // envio url de la imagen vieja a reemplazar pa que se elimine
            } catch (error:Error | any) {
                console.error(error);
                // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                throw new Error(error.message);
            }
        }

        // Puede que no se haya enviado la imagen para reemplazar la anterior, en dicho caso sus valores seguirian en undefined
        // en tal caso se actualizará el registro con el nombre anterior
        if(news.img_url == undefined || news.img_url == null || news.img_url == ""){
            news.img_url = newsDB.img_url;
        }

        try {
            // Se mueven la imagen solo despues de que se validaron las 3 de forma definiva
            if(img_url_aux != "" && ruta_to_save != ""){
                //fs.renameSync(img_url_aux, ruta_to_save);
                await mvPromise(img_url_aux, ruta_to_save);
            }
        } catch (error:Error | any) {
            console.log("Error copying file");
            console.error(error);
            throw new Error("No se pudo reemplazar la Imagen de Portada, error interno.");
        }

        return await this.newsRepo.update(news)
    }
    async delete(id: number) : Promise<boolean> {
        try {
            let newsToDelete = await this.newsRepo.byIDAdmin(id);
            console.log(newsToDelete);
            
            if (newsToDelete === null) {
                throw new Error("Noticia no encontrada.5");
            }
        } catch (error:Error | any) {
            throw new Error(error.message ?? "Error al buscar la Noticia a eliminar o Noticia no encontrado.");
        }

        if(await this.newsRepo.hasNewsContent(id)){
            throw new Error("La Noticia que está intentando eliminar posee Componentes registrados, no se puede eliminar.");
        }

        if(await this.podcastRepo.isThisNewsLinked(id)){
            throw new Error("La Noticia que está intentando eliminar se encuentra Ligada a un Podcast registrado, no se puede eliminar.");
        }

        try {
            await this.deletePhotoNews(id);
        } catch (error:Error | any) {
            throw new Error(error.message ?? "No se pudo eliminar los archivos de la Noticia, error interno.");
        }
        return await this.newsRepo.delete(id)
    }

    async deletePhotoNews(id: number) : Promise<void>{
        const foundRows = await this.newsRepo.byIDAdmin(id);
        
        try {
            if(foundRows?.img_url != null && foundRows?.img_url != ""){
                if (!fs.existsSync(ruta_imagen + foundRows?.img_url)) {
                    return;
                }
                fs.unlinkSync(ruta_imagen + foundRows?.img_url);
            }
        } catch (error:Error | any) {
            console.log("Error deleting old file");
            console.log(error);
            throw new Error("No se pudo eliminar los archivos de la Noticia, error interno.");
        }
    }

    verifyFileExists(new_image: string, img_url_old_cropped:boolean) : string[]{
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
        let ruta_to_verify = ruta_imagen + originalname_aux;
        // Verifico que img_url_old_cropped sea falsa para poder hacer la verificación, caso contrario si existe la imagen pero
        // se la quiere reemplazar por otra versión croppeada de la misma.
        if (fs.existsSync(ruta_to_verify) && !img_url_old_cropped) {
            throw new Error("El nombre de la Imagen de Portada de la Noticia ya se encuentra en uso, cambie el nombre y vuelva a subirla.");
        }
        return [ruta_to_verify, originalname_aux];
    }

    deleteOldFileOnUpdate(old_image: string) : void{
        // Si guardo la foto nueva entonces debo eliminar la anterior que obtengo mediante podcastDB
        let ruta_imagen_to_delete = ruta_imagen + old_image;
        try {
            if (!fs.existsSync(ruta_imagen_to_delete)) {
                return;
            }

            fs.unlinkSync(ruta_imagen_to_delete);
        } catch (error:Error | any) {
            console.log("Error deleting old file");
            console.log(error);
            throw new Error("No se pudo eliminar la Imagen Anterior que se esta intentado reemplazar.");
        }
    }
}