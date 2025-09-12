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
exports.NewsContentCRUDUC = void 0;
const fs_1 = __importDefault(require("fs"));
const mv_1 = __importDefault(require("mv"));
const util_1 = __importDefault(require("util"));
const os_1 = __importDefault(require("os"));
const mvPromise = util_1.default.promisify((source, dest, cb) => (0, mv_1.default)(source, dest, { mkdirp: true }, (err) => cb(err)));
const ruta_imagen = __dirname.replace("src\\news_content\\usecase", "").replace("src/news_content/usecase", "") + (os_1.default.platform() === "linux" ? "public/news_content/img/" : "public\\news_content\\img\\");
const ruta_audio = __dirname.replace("src\\news_content\\usecase", "").replace("src/news_content/usecase", "") + (os_1.default.platform() === "linux" ? "public/news_content/audio/" : "public\\news_content\\audio\\");
const ruta_video = __dirname.replace("src\\news_content\\usecase", "").replace("src/news_content/usecase", "") + (os_1.default.platform() === "linux" ? "public/news_content/video/" : "public\\news_content\\video\\");
class NewsContentCRUDUC {
    constructor(newsRepo, newsContentRepo) {
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
    }
    listByNewsId(news_id_to_list) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsContentRepo.listByNewsId(news_id_to_list);
        });
    }
    byID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let news_content = yield this.newsContentRepo.byID(id);
            if (news_content == null) {
                throw new Error("No se encontró el Componente de la Noticia.");
            }
            return news_content;
        });
    }
    register(news_content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (news_content.tipo === 2 && news_content.contenido !== '') {
                // registro de imagen
                let ruta_to_save = "";
                let img_url_aux = "";
                if (news_content.contenido !== '') {
                    let verify_result = [];
                    try {
                        // Envio como tercer parametro el false porque en registrar no debo verificar si es una imagen cropeada ya subida al servidor
                        verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                    }
                    catch (error) {
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
                    yield mvPromise(img_url_aux, ruta_to_save);
                }
                catch (error) {
                    console.log("Error copying file");
                    console.error(error);
                    throw new Error("No se pudo almacenar la Imagen del Componente, error interno.");
                }
            }
            if (news_content.tipo === 3 && news_content.contenido !== '') {
                // registro de Video
                let ruta_to_save = "";
                let video_url_aux = "";
                if (news_content.contenido !== '') {
                    let verify_result = [];
                    try {
                        // Envio como tercer parametro el false porque en registrar no debo verificar si es una imagen cropeada ya subida al servidor
                        verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                    }
                    catch (error) {
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
                    yield mvPromise(video_url_aux, ruta_to_save);
                }
                catch (error) {
                    console.log("Error copying file");
                    console.error(error);
                    throw new Error("No se pudo almacenar el Video del Componente, error interno.");
                }
            }
            if (news_content.tipo === 4 && news_content.contenido !== '') {
                // registro de Audio
                let ruta_to_save = "";
                let audio_url_aux = "";
                if (news_content.contenido !== '') {
                    let verify_result = [];
                    try {
                        // Envio como tercer parametro el false porque en registrar no debo verificar si es una imagen cropeada ya subida al servidor
                        verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                    }
                    catch (error) {
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
                    yield mvPromise(audio_url_aux, ruta_to_save);
                }
                catch (error) {
                    console.log("Error copying file");
                    console.error(error);
                    throw new Error("No se pudo almacenar el Audio del Componente, error interno.");
                }
            }
            return yield this.newsContentRepo.register(news_content, news_content.news_id);
        });
    }
    update(news_content, img_url_old_cropped) {
        return __awaiter(this, void 0, void 0, function* () {
            let news_content_DB = yield this.newsContentRepo.byID(news_content.id);
            if (news_content_DB == null) {
                throw new Error("No se encontró la Noticia");
            }
            if (news_content.tipo === 2) {
                // registro de imagen
                let ruta_to_save = "";
                let img_url_aux = "";
                // Primero reviso que sea diferente de vacio
                if (news_content.contenido !== '' && news_content.contenido !== undefined && news_content.contenido !== null) {
                    let verify_result = [];
                    try {
                        // Envio contenido, tipo para el mensaje de error y el verificador de imagen ya subida en el servidor cropeada.
                        verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, img_url_old_cropped);
                    }
                    catch (error) {
                        console.error(error);
                        // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                        throw new Error(error.message);
                    }
                    ruta_to_save = verify_result[0]; // ruta_to_verify
                    img_url_aux = news_content.contenido;
                    news_content.contenido = verify_result[1]; // originalname_aux
                    if (news_content_DB.contenido !== '' && news_content_DB.contenido !== null && news_content_DB.contenido !== undefined) {
                        try {
                            this.deleteOldFileOnUpdate(news_content_DB.contenido, news_content_DB.tipo); // envio url de la imagen vieja a reemplazar pa que se elimine
                        }
                        catch (error) {
                            console.error(error);
                            // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                            throw new Error(error.message);
                        }
                    }
                }
                try {
                    // Se mueven la imagen solo despues de que se validó de forma definiva
                    if (img_url_aux != "" && ruta_to_save != "") {
                        //fs.renameSync(img_url_aux, ruta_to_save);
                        yield mvPromise(img_url_aux, ruta_to_save);
                    }
                }
                catch (error) {
                    console.log("Error copying file");
                    console.error(error);
                    throw new Error("No se pudo almacenar la Imagen del Componente, error interno.");
                }
            }
            if (news_content.tipo === 3 && news_content.contenido !== '') {
                // registro de Video
                let ruta_to_save = "";
                let video_url_aux = "";
                if (news_content.contenido !== '') {
                    let verify_result = [];
                    try {
                        verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                    }
                    catch (error) {
                        console.error(error);
                        // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                        throw new Error(error.message);
                    }
                    ruta_to_save = verify_result[0]; // ruta_to_verify
                    video_url_aux = news_content.contenido;
                    news_content.contenido = verify_result[1]; // originalname_aux
                    if (news_content_DB.contenido !== '' && news_content_DB.contenido !== null && news_content_DB.contenido !== undefined) {
                        try {
                            this.deleteOldFileOnUpdate(news_content_DB.contenido, news_content_DB.tipo); // envio url de la imagen vieja a reemplazar pa que se elimine
                        }
                        catch (error) {
                            console.error(error);
                            // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                            throw new Error(error.message);
                        }
                    }
                }
                try {
                    // Se mueven la imagen solo despues de que se validó de forma definiva
                    if (video_url_aux != "" && ruta_to_save != "") {
                        //fs.renameSync(img_url_aux, ruta_to_save);
                        yield mvPromise(video_url_aux, ruta_to_save);
                    }
                }
                catch (error) {
                    console.log("Error copying file");
                    console.error(error);
                    throw new Error("No se pudo almacenar el Video del Componente, error interno.");
                }
            }
            if (news_content.tipo === 4 && news_content.contenido !== '') {
                // registro de Audio
                let ruta_to_save = "";
                let audio_url_aux = "";
                if (news_content.contenido !== '') {
                    let verify_result = [];
                    try {
                        verify_result = this.verifyFileExists(news_content.contenido, news_content.tipo, false);
                    }
                    catch (error) {
                        console.error(error);
                        // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de verifyFileExists
                        throw new Error(error.message);
                    }
                    ruta_to_save = verify_result[0]; // ruta_to_verify
                    audio_url_aux = news_content.contenido;
                    news_content.contenido = verify_result[1]; // originalname_aux
                    if (news_content_DB.contenido !== '' && news_content_DB.contenido !== null && news_content_DB.contenido !== undefined) {
                        try {
                            this.deleteOldFileOnUpdate(news_content_DB.contenido, news_content_DB.tipo); // envio url de la imagen vieja a reemplazar pa que se elimine
                        }
                        catch (error) {
                            console.error(error);
                            // Se retorna en un throw a la capa de delivery el mensaje que ya de por si viene del throw de deleteOldFileOnUpdate
                            throw new Error(error.message);
                        }
                    }
                }
                try {
                    // Se mueven la imagen solo despues de que se validó de forma definiva
                    if (audio_url_aux != "" && ruta_to_save != "") {
                        //fs.renameSync(img_url_aux, ruta_to_save);
                        yield mvPromise(audio_url_aux, ruta_to_save);
                    }
                }
                catch (error) {
                    console.log("Error copying file");
                    console.error(error);
                    throw new Error("No se pudo almacenar el Audio del Componente, error interno.");
                }
            }
            // Puede que no se haya enviado la imagen para reemplazar la anterior, en dicho caso sus valores seguirian en undefined
            // en tal caso se actualizará el registro con el nombre anterior
            if (news_content.contenido == undefined || news_content.contenido == null || news_content.contenido == "") {
                if (news_content.tipo < 2 && news_content.tipo > 4) {
                    news_content.contenido = "";
                }
                else {
                    news_content.contenido = news_content_DB.contenido;
                }
            }
            return yield this.newsContentRepo.update(news_content);
        });
    }
    delete(news_content_id_to_delete) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newsToDelete = this.newsContentRepo.byID(news_content_id_to_delete);
                if (newsToDelete === null) {
                    throw new Error("Componente de la Noticia no encontrado.");
                }
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : "Error al buscar el Componente de la Noticia a eliminar o Componente no encontrado.");
            }
            try {
                yield this.deletePhotoAudioVideoNewsContent(news_content_id_to_delete);
            }
            catch (error) {
                throw new Error((_b = error.message) !== null && _b !== void 0 ? _b : "No se pudo eliminar los archivos del Componente de la Noticia, error interno.");
            }
            return yield this.newsContentRepo.delete(news_content_id_to_delete);
        });
    }
    deletePhotoAudioVideoNewsContent(news_content_id_to_delete) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundRows = yield this.newsContentRepo.byID(news_content_id_to_delete);
            try {
                if ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.tipo) === 2 && ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido) != null && (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido) != "")) {
                    if (!fs_1.default.existsSync(ruta_imagen + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido))) {
                        return;
                    }
                    fs_1.default.unlinkSync(ruta_imagen + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido));
                }
                if ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.tipo) === 3 && ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido) != null && (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido) != "")) {
                    if (!fs_1.default.existsSync(ruta_video + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido))) {
                        return;
                    }
                    fs_1.default.unlinkSync(ruta_video + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido));
                }
                if ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.tipo) === 4 && ((foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido) != null && (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido) != "")) {
                    if (!fs_1.default.existsSync(ruta_audio + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido))) {
                        return;
                    }
                    fs_1.default.unlinkSync(ruta_audio + (foundRows === null || foundRows === void 0 ? void 0 : foundRows.contenido));
                }
            }
            catch (error) {
                console.log("Error deleting old file");
                console.log(error);
                throw new Error("No se pudo eliminar los archivos del Componente de la Noticia, error interno");
            }
        });
    }
    verifyFileExists(new_image, tipo_file, img_url_old_cropped) {
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
        let ruta_to_verify = "";
        if (tipo_file == 2) { // IMG
            ruta_to_verify = ruta_imagen + originalname_aux;
            if (fs_1.default.existsSync(ruta_to_verify) && !img_url_old_cropped) {
                throw new Error("El nombre de la Imagen ya se encuentra en uso, cambie el nombre y vuelva a subirla.");
            }
        }
        if (tipo_file == 3) { // VIDEO
            ruta_to_verify = ruta_video + originalname_aux;
            if (fs_1.default.existsSync(ruta_to_verify)) {
                throw new Error("El nombre del Video ya se encuentra en uso, cambie el nombre y vuelvalo a subir.");
            }
        }
        if (tipo_file == 4) { // AUDIO
            ruta_to_verify = ruta_audio + originalname_aux;
            if (fs_1.default.existsSync(ruta_to_verify)) {
                throw new Error("El nombre del Audio ya se encuentra en uso, cambie el nombre y vuelvalo a subir.");
            }
        }
        return [ruta_to_verify, originalname_aux];
    }
    deleteOldFileOnUpdate(old_image, tipo_file) {
        // Si guardo la foto nueva entonces debo eliminar la anterior que obtengo mediante podcastDB
        let ruta_file_to_delete = "";
        if (tipo_file == 2) { // IMG
            ruta_file_to_delete = ruta_imagen + old_image;
        }
        if (tipo_file == 3) { // VIDEO
            ruta_file_to_delete = ruta_video + old_image;
        }
        if (tipo_file == 4) { // AUDIO
            ruta_file_to_delete = ruta_audio + old_image;
        }
        try {
            if (!fs_1.default.existsSync(ruta_file_to_delete)) {
                return;
            }
            fs_1.default.unlinkSync(ruta_file_to_delete);
        }
        catch (error) {
            console.log("Error deleting old file");
            console.log(error);
            if (tipo_file == 2) { // IMG
                throw new Error("No se pudo eliminar la Imagen Anterior que se esta intentado reemplazar.");
            }
            if (tipo_file == 3) { // VIDEO
                throw new Error("No se pudo eliminar el Video Anterior que se esta intentado reemplazar.");
            }
            if (tipo_file == 4) { // AUDIO
                throw new Error("No se pudo eliminar el Audio Anterior que se esta intentado reemplazar.");
            }
        }
    }
}
exports.NewsContentCRUDUC = NewsContentCRUDUC;
