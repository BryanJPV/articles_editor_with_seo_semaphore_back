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
exports.NewsAdminHandler = void 0;
const express_1 = require("express");
const multer_1 = require("multer");
const uploadImages_1 = __importDefault(require("./multer/uploadImages"));
const schemaRegister_1 = __importDefault(require("./joi_validator/schemaRegister"));
class NewsAdminHandler {
    constructor(newsUC, userUC) {
        this.newsUC = newsUC;
        this.userUC = userUC;
    }
    init(apiInstance) {
        let subRouter = (0, express_1.Router)({ mergeParams: true });
        subRouter.get('/list', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.list(req, res); }));
        subRouter.get('/by_id/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.byID(req, res); }));
        subRouter.post('/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, uploadImages_1.default)(req, res, (err) => {
                /* console.log("error");
                console.log(err); */
                // err tiene el error que retorna el callback de la validación de Multer
                // En caso que err sea un error de multer
                if (err instanceof multer_1.MulterError) {
                    // A Multer error occurred when uploading.
                    res.status(400);
                    res.json({ error: [err.message] });
                    return;
                }
                // En caso que err sea un mensaje de error simple en un string
                if (typeof err == "string") {
                    // An unknown error occurred when uploading.
                    res.status(400);
                    res.json({ error: [err] });
                    return;
                }
                this.register(req, res);
            });
        }));
        subRouter.put('/update/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, uploadImages_1.default)(req, res, (err) => {
                /* console.log("error");
                console.log(err); */
                // err tiene el error que retorna el callback de la validación de Multer
                // En caso que err sea un error de multer
                if (err instanceof multer_1.MulterError) {
                    // A Multer error occurred when uploading.
                    res.status(400);
                    res.json({ error: [err.message] });
                    return;
                }
                // En caso que err sea un mensaje de error simple en un string
                if (typeof err == "string") {
                    // An unknown error occurred when uploading.
                    res.status(400);
                    res.json({ error: [err] });
                    return;
                }
                this.update(req, res);
            });
        }));
        subRouter.delete('/delete/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.delete(req, res); }));
        apiInstance.use('/news', subRouter);
    }
    verifyAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers.authorization === undefined || req.headers.authorization == '') {
                res.status(403).send({ error: ["No estas autorizado para acceder a esta funcionalidad, intente Iniciar Sesión primero."] });
                return false;
            }
            try {
                if (req.headers.authorization !== null || req.headers.authorization !== undefined || req.headers.authorization !== '') {
                    let token = req.headers.authorization;
                    let expiration = null;
                    if (token !== undefined) {
                        token = token.replace("Bearer ", "");
                        expiration = yield this.userUC.checkTokenExpiration(token);
                        if (expiration) {
                            res.status(403).send({ error: ["No estas autorizado para acceder a esta funcionalidad, intente Iniciar Sesión primero."] });
                            return false;
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(403).send({ error: ["No estas autorizado para acceder a esta funcionalidad, intente Iniciar Sesión primero."] });
                return false;
            }
            return true;
        });
    }
    parsingSeoUrl(seo_url) {
        return __awaiter(this, void 0, void 0, function* () {
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
                .replace(/[^a-z0-9-_.]/g, '');
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isAuthenticated = yield this.verifyAuth(req, res);
            if (!isAuthenticated) {
                return;
            }
            let news_res = yield this.newsUC.list();
            res.json(news_res);
        });
    }
    byID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let isAuthenticated = yield this.verifyAuth(req, res);
            if (!isAuthenticated) {
                return;
            }
            if (req.params.id == undefined) {
                res.status(400);
                res.json({ error: ["El ID de la Noticia debe ser un valor numérico."] });
                return;
            }
            let id_to_search = (typeof req.params.id === 'string') ? parseInt(req.params.id) : req.params.id;
            let news = null;
            try {
                news = yield this.newsUC.byID(id_to_search);
                if (news == null) {
                    res.status(400);
                    res.json({ error: ["No se encontró la Noticia."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se encontró la Noticia."] });
                return;
            }
            res.json(news);
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let isAuthenticated = yield this.verifyAuth(req, res);
            if (!isAuthenticated) {
                return;
            }
            // Parsing Seo_Url
            let seo_url_parseado = yield this.parsingSeoUrl(req.body.seo_url);
            const payload = {
                titulo: req.body.titulo,
                subtitulo: req.body.subtitulo,
                seo_url: seo_url_parseado,
                keywords: req.body.keywords,
                status: parseInt(req.body.status),
                /* publish_date: req.body.publish_date, */
            };
            //console.log(payload);
            let array_errors_schema_validator = [];
            try {
                const value = yield schemaRegister_1.default.validateAsync(payload, { abortEarly: false });
            }
            catch (error) {
                //console.log(error.details);
                error.details.forEach((error_detail) => {
                    array_errors_schema_validator.push(error_detail.message);
                });
                res.status(400);
                res.json({ error: array_errors_schema_validator });
                return;
            }
            let files = req.files;
            let image_name = null;
            try {
                // VALIDACIÓN FILE IMG
                if (files == undefined || files['img_url_blob'] == null || files['img_url_blob'][0] == undefined) {
                    res.status(400);
                    res.json({ error: ["No se puede registrar la Noticia sin subir ninguna Imagen."] });
                    return;
                }
                // VALIDACIÓN PESO FILE IMG
                let peso_img_url_blob = files['img_url_blob'][0].size;
                let peso_max_img_url_blob = 15 * 1024 * 1024; // 15Mb
                if (peso_img_url_blob > peso_max_img_url_blob) {
                    res.status(400);
                    res.json({ error: ["El peso de la Imagen cargada no debe superar los 15 Mb."] });
                    return;
                }
                image_name = files['img_url_blob'].length > 0 ? files['img_url_blob'][0].path : null;
            }
            catch (error) {
                /* console.log("Error uploading files");
                console.log(error);*/
                res.status(400);
                res.json({ error: ["Se verifico un error intentando subir la imagen."] });
                return;
            }
            let newsJSON = req.body;
            let news = {
                id: 0,
                titulo: newsJSON.titulo,
                subtitulo: newsJSON.subtitulo,
                seo_url: seo_url_parseado,
                img_url: image_name !== null && image_name !== void 0 ? image_name : '',
                keywords: newsJSON.keywords,
                status: newsJSON.status === "1" ? true : false,
                publish_date: new Date(newsJSON.publish_date) /* .toDateString() */,
                created_at: new Date(),
                updated_at: new Date(),
                news_content: []
            };
            let newNews = null;
            try {
                newNews = yield this.newsUC.register(news);
                if (newNews == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo registrar la Noticia"] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo registrar la Noticia, intente de nuevo."] });
                return;
            }
            res.json({ message: "Se ha registrado la Noticia exitosamente.", data: newNews /* , id: newNews.id */ });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let isAuthenticated = yield this.verifyAuth(req, res);
            if (!isAuthenticated) {
                return;
            }
            if (req.params.id == undefined) {
                res.status(400);
                res.json({ error: ["El ID de la Noticia debe ser un valor numérico."] });
                return;
            }
            let id_to_update = (typeof req.params.id === 'string') ? parseInt(req.params.id) : req.params.id;
            // Parsing Seo_Url
            let seo_url_parseado = yield this.parsingSeoUrl(req.body.seo_url);
            const payload = {
                titulo: req.body.titulo,
                subtitulo: req.body.subtitulo,
                seo_url: seo_url_parseado,
                keywords: req.body.keywords,
                status: parseInt(req.body.status),
                /* publish_date: req.body.publish_date, */
            };
            //console.log(payload);
            let array_errors_schema_validator = [];
            try {
                const value = yield schemaRegister_1.default.validateAsync(payload, { abortEarly: false });
            }
            catch (error) {
                //console.log(error.details);
                error.details.forEach((error_detail) => {
                    array_errors_schema_validator.push(error_detail.message);
                });
                res.status(400);
                res.json({ error: array_errors_schema_validator });
                return;
            }
            let files = req.files;
            let image_name = null;
            try {
                // VALIDACIÓN FILE IMG
                if (files != undefined) {
                    if (files['img_url_blob'] != undefined && files['img_url_blob'] != null && files['img_url_blob'][0] != undefined) {
                        // VALIDACIÓN PESO FILE IMG
                        let peso_img_url_blob = files['img_url_blob'][0].size;
                        let peso_max_img_url_blob = 15 * 1024 * 1024; // 15Mb
                        if (peso_img_url_blob > peso_max_img_url_blob) {
                            res.status(400);
                            res.json({ error: ["El peso de la Imagen cargada no debe superar los 15 Mb."] });
                            return;
                        }
                        image_name = files['img_url_blob'].length > 0 ? files['img_url_blob'][0].path : null;
                    }
                }
            }
            catch (error) {
                /* console.log("Error uploading files");
                console.log(error);*/
                res.status(400);
                res.json({ error: ["Se verifico un error intentando subir la imagen."] });
                return;
            }
            let newsJSON = req.body;
            let news = {
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
            };
            // Controlador que indica que la imagen cargada en la petición no es nueva, es la misma que ya esta en public pero esta se manda
            // solo cropeada para que no se muestre el error del verifyFileExists
            let img_url_old_cropped = false;
            if (req.body.img_url_old_cropped !== undefined && req.body.img_url_old_cropped !== null) {
                img_url_old_cropped = req.body.img_url_old_cropped === 'true' ? true : false;
            }
            let updatedNews = null;
            try {
                updatedNews = yield this.newsUC.update(news, img_url_old_cropped);
                if (updatedNews == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo actualizar la Noticia."] });
                    return;
                }
            }
            catch (error) {
                //console.log(error);
                res.status(400);
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo actualizar la Noticia, intente de nuevo."] });
                return;
            }
            res.json({ message: "Se ha actualizado la Noticia exitosamente.", data: updatedNews });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let isAuthenticated = yield this.verifyAuth(req, res);
            if (!isAuthenticated) {
                return;
            }
            if (req.params.id == undefined) {
                res.status(400);
                res.json({ error: ["El ID de la Noticia debe ser un valor numérico."] });
                return;
            }
            let id_to_delete = (typeof req.params.id === 'string') ? parseInt(req.params.id) : req.params.id;
            let newNews = null;
            try {
                newNews = yield this.newsUC.delete(id_to_delete);
                if (newNews == null) {
                    res.status(400);
                    res.json({ error: ["Error al buscar la Noticia a eliminar o Noticia no encontrado."] });
                    return;
                }
            }
            catch (error) {
                //console.log(error);
                res.status(400);
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "Error al buscar la Noticia a eliminar o Noticia no encontrado."] });
                return;
            }
            res.json({ message: "Se ha eliminado la Noticia exitosamente." });
        });
    }
}
exports.NewsAdminHandler = NewsAdminHandler;
