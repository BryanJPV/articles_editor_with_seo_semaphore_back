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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsCommonHandler = void 0;
const express_1 = require("express");
class NewsCommonHandler {
    constructor(newsUC) {
        this.newsUC = newsUC;
    }
    init(apiInstance) {
        let subRouter = (0, express_1.Router)({ mergeParams: true });
        subRouter.get('/list', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.list(req, res); }));
        subRouter.get('/by_pagination/:inicio/:cantidad', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.listByPagination(req, res); }));
        subRouter.get('/by_id/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.byID(req, res); }));
        subRouter.get('/by_seo_url/:seo_url', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.bySeoURL(req, res); }));
        apiInstance.use('/news', subRouter);
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let news_res = yield this.newsUC.list();
            res.json(news_res);
        });
    }
    listByPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let inicio = 0;
            if (req.params.inicio !== undefined && req.params.inicio !== null) {
                if (parseInt(req.params.inicio) < 1) {
                    inicio = 0;
                }
                else {
                    inicio = parseInt(req.params.inicio);
                }
            }
            let cantidad = 0;
            if (req.params.cantidad !== undefined && req.params.cantidad !== null) {
                if (parseInt(req.params.cantidad) < 1) {
                    cantidad = 165163815613351;
                }
                else {
                    cantidad = parseInt(req.params.cantidad);
                }
            }
            let events_res = yield this.newsUC.listByPagination(inicio, cantidad);
            res.json(events_res);
        });
    }
    byID(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let id_to_search = parseInt(req.params.id);
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
    bySeoURL(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let seo_url_to_search = req.params.seo_url;
            let news = null;
            try {
                news = yield this.newsUC.bySeoURL(seo_url_to_search);
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
}
exports.NewsCommonHandler = NewsCommonHandler;
