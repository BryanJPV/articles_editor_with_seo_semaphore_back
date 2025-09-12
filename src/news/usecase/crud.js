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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsCRUDUC = void 0;
const fs_1 = __importDefault(require("fs"));
const mv_1 = __importDefault(require("mv"));
const util_1 = __importDefault(require("util"));
const os_1 = __importDefault(require("os"));
const mvPromise = util_1.default.promisify((source, dest, cb) => (0, mv_1.default)(source, dest, { mkdirp: true }, (err) => cb(err)));
const ruta_imagen = __dirname.replace("src\\news\\usecase", "").replace("src/news/usecase", "") + (os_1.default.platform() === "linux" ? "public/news/img/" : "public\\news\\img\\");
class NewsCRUDUC {
    constructor(newsRepo, newsContentRepo, podcastRepo) {
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
        this.podcastRepo = podcastRepo;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            let newsList = yield this.newsRepo.listAdmin();
            for (let index = 0; index < newsList.length; index++) {
                let newsContentList = yield this.newsContentRepo.listByNewsId(newsList[index].id);
                newsList[index].news_content = newsContentList;
            }
            return newsList; //await this.newsRepo.list()
        });
    }
    byID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let news = yield this.newsRepo.byIDAdmin(id);
            if (news == null) {
                throw new Error("No se encontró la Noticia.");
            }
            news.news_content = yield this.newsContentRepo.listByNewsId(news.id);
            return news;
        });
    }
    register(news) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.newsRepo.existSeoUrl(news.seo_url, 0)) {
                throw new Error("El Seo Url ingresado ya existe, cambielo.");
            }
            // registro de imagen
            let ruta_to_save = "";
            let img_url_aux = "";
            if (news.img_url !== '') {
                let verify_result = [];
                try {
                    // Envio false como img_url_old_cropped:boolean porque solo se debería verificar su uso en Update
                    verify_result = this.verifyFileExists(news.img_url, false);
                }
                catch (error) {
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
                yield mvPromise(img_url_aux, ruta_to_save);
            }
            catch (error) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo almacenar la Imagen de Portada, error interno.");
            }
            return yield this.newsRepo.register(news);
        });
    }
    update(news, img_url_old_cropped) {
        return __awaiter(this, void 0, void 0, function* () {
            let newsDB = yield this.newsRepo.byIDAdmin(news.id);
            if (newsDB == null) {
                throw new Error("No se encontró la Noticia");
            }
            if (yield this.newsRepo.existSeoUrl(news.seo_url, news.id)) {
                throw new Error("El Seo Url ingresado ya existe, cambielo.");
            }
            // Verifico que el archivo ya exista
            // registro de imagen
            let ruta_to_save = "";
            let img_url_aux = "";
            // Primero reviso que sea diferente de vacio
            if (news.img_url !== '' && news.img_url !== undefined && news.img_url !== null) {
                let verify_result = [];
                try {
                    verify_result = this.verifyFileExists(news.img_url, img_url_old_cropped);
                }
                catch (error) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                    throw new Error(error.message);
                }
                ruta_to_save = verify_result[0]; // ruta_to_verify
                img_url_aux = news.img_url;
                news.img_url = verify_result[1]; // originalname_aux
                try {
                    this.deleteOldFileOnUpdate(newsDB.img_url); // envio url de la imagen vieja a reemplazar pa que se elimine
                }
                catch (error) {
                    console.error(error);
                    // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                    throw new Error(error.message);
                }
            }
            // Puede que no se haya enviado la imagen para reemplazar la anterior, en dicho caso sus valores seguirian en undefined
            // en tal caso se actualizará el registro con el nombre anterior
            if (news.img_url == undefined || news.img_url == null || news.img_url == "") {
                news.img_url = newsDB.img_url;
            }
            try {
                // Se mueven la imagen solo despues de que se validaron las 3 de forma definiva
                if (img_url_aux != "" && ruta_to_save != "") {
                    //fs.renameSync(img_url_aux, ruta_to_save);
                    yield mvPromise(img_url_aux, ruta_to_save);
                }
            }
            catch (error) {
                console.log("Error copying file");
                console.error(error);
                throw new Error("No se pudo reemplazar la Imagen de Portada, error interno.");
            }
            return yield this.newsRepo.update(news);
        });
    }
    delete(id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newsToDelete = yield this.newsRepo.byIDAdmin(id);
                console.log(newsToDelete);
                if (newsToDelete === null) {
                    throw new Error("Noticia no encontrada.5");
                }
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Error al buscar la Noticia a eliminar o Noticia no encontrado.");
            }
            if (yield this.newsRepo.hasNewsContent(id)) {
                throw new Error("La Noticia que está intentando eliminar posee Componentes registrados, no se puede eliminar.");
            }
            if (yield this.podcastRepo.isThisNewsLinked(id)) {
                throw new Error("La Noticia que está intentando eliminar se encuentra Ligada a un Podcast registrado, no se puede eliminar.");
            }
            try {
                yield this.deletePhotoNews(id);
            }
            catch (error) {
                throw new Error((_b = error.message) !== null && _b !== void 0 ? _b : "No se pudo eliminar los archivos de la Noticia, error interno.");
            }
            return yield this.newsRepo.delete(id);
        });
    }
    deletePhotoNews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundRows = yield this.newsRepo.byIDAdmin(id);
            try {
                if ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.img_url) != null && (foundRows === null || foundRows === void 0 ? void 0 : foundRows.img_url) != "") {
                    if (!fs_1.default.existsSync(ruta_imagen + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.img_url))) {
                        return;
                    }
                    fs_1.default.unlinkSync(ruta_imagen + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.img_url));
                }
            }
            catch (error) {
                console.log("Error deleting old file");
                console.log(error);
                throw new Error("No se pudo eliminar los archivos de la Noticia, error interno.");
            }
        });
    }
    verifyFileExists(new_image, img_url_old_cropped) {
        let originalname_aux = "";
        let array_string = [];
        if (new_image.includes('/')) {
            // linux
            array_string = new_image.split("/");
            originalname_aux = array_string[array_string.length - 1];
        }
        else {
            // windows
            array_string = new_image.split("\\");
            originalname_aux = array_string[array_string.length - 1];
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
        if (fs_1.default.existsSync(ruta_to_verify) && !img_url_old_cropped) {
            throw new Error("El nombre de la Imagen de Portada de la Noticia ya se encuentra en uso, cambie el nombre y vuelva a subirla.");
        }
        return [ruta_to_verify, originalname_aux];
    }
    deleteOldFileOnUpdate(old_image) {
        // Si guardo la foto nueva entonces debo eliminar la anterior que obtengo mediante podcastDB
        let ruta_imagen_to_delete = ruta_imagen + old_image;
        try {
            if (!fs_1.default.existsSync(ruta_imagen_to_delete)) {
                return;
            }
            fs_1.default.unlinkSync(ruta_imagen_to_delete);
        }
        catch (error) {
            console.log("Error deleting old file");
            console.log(error);
            throw new Error("No se pudo eliminar la Imagen Anterior que se esta intentado reemplazar.");
        }
    }
}
exports.NewsCRUDUC = NewsCRUDUC;
