"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.ORMNewsRepository = exports.NewsORM = void 0;
const news_1 = require("../../domain/news");
const typeorm_1 = require("typeorm");
const orm_1 = require("../../news_content/repository/orm");
let NewsORM = class NewsORM {
    toNews() {
        let news = new news_1.News();
        news.id = this.id;
        news.titulo = this.titulo;
        news.subtitulo = this.subtitulo;
        news.seo_url = this.seo_url;
        news.img_url = this.img_url;
        news.keywords = this.keywords;
        news.status = this.status;
        news.publish_date = this.publish_date;
        news.created_at = this.createdAt;
        news.updated_at = this.updatedAt;
        news.news_content = [];
        return news;
    }
    fromNews(news) {
        this.id = news.id;
        this.titulo = news.titulo;
        this.subtitulo = news.subtitulo;
        this.seo_url = news.seo_url;
        this.img_url = news.img_url;
        this.keywords = news.keywords;
        this.status = news.status;
        this.publish_date = new Date(news.publish_date);
        return this;
    }
};
exports.NewsORM = NewsORM;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], NewsORM.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150, nullable: false }),
    __metadata("design:type", String)
], NewsORM.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 250, nullable: false }),
    __metadata("design:type", String)
], NewsORM.prototype, "subtitulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: false }),
    __metadata("design:type", String)
], NewsORM.prototype, "seo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: false }),
    __metadata("design:type", String)
], NewsORM.prototype, "img_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: false }),
    __metadata("design:type", String)
], NewsORM.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: false, default: true }),
    __metadata("design:type", Boolean)
], NewsORM.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], NewsORM.prototype, "publish_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NewsORM.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], NewsORM.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orm_1.NewsContentORM, newsContent => newsContent.news),
    __metadata("design:type", Array)
], NewsORM.prototype, "newsContent", void 0);
exports.NewsORM = NewsORM = __decorate([
    (0, typeorm_1.Entity)("news")
], NewsORM);
class ORMNewsRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.newsRepoORM = this.dataSource.getRepository(NewsORM);
        this.newsContentRepoORM = this.dataSource.getRepository(orm_1.NewsContentORM);
    }
    // Common
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const newsModels = yield this.newsRepoORM.find({
                where: [
                    { status: true, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                    { status: true, publish_date: (0, typeorm_1.IsNull)() }
                ],
                order: { publish_date: "DESC" }
            });
            const news = newsModels.map((newsORM) => newsORM.toNews());
            return news;
        });
    }
    listByPagination(inicio, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (cantidad > 0 && inicio > 0) {
                const newsModels = yield this.newsRepoORM.find({
                    where: [
                        { status: true, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                        { status: true, publish_date: (0, typeorm_1.IsNull)() }
                    ],
                    order: {
                        publish_date: "DESC"
                    },
                    skip: inicio,
                    take: cantidad,
                });
                const news = newsModels.map((newsORM) => newsORM.toNews());
                return news;
            }
            if (cantidad > 0 && inicio === 0) {
                const newsModels = yield this.newsRepoORM.find({
                    where: [
                        { status: true, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                        { status: true, publish_date: (0, typeorm_1.IsNull)() }
                    ],
                    order: {
                        publish_date: "DESC"
                    },
                    skip: 0,
                    take: cantidad,
                });
                const news = newsModels.map((newsORM) => newsORM.toNews());
                return news;
            }
            return [];
        });
    }
    byID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const newsModel = yield this.newsRepoORM.find({
                where: [
                    { id: id, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                    { id: id, publish_date: (0, typeorm_1.IsNull)() }
                ],
            });
            if (newsModel[0] === null || newsModel[0] === undefined || !newsModel[0].status) {
                console.log('Not found!');
                return null;
            }
            return newsModel[0].toNews();
        });
    }
    bySeoURL(seo_url_to_search) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const newsModel = yield this.newsRepoORM.find({
                where: [
                    { seo_url: seo_url_to_search, status: true, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                    { seo_url: seo_url_to_search, status: true, publish_date: (0, typeorm_1.IsNull)() }
                ],
            });
            if (newsModel === null) {
                console.log('Not found!');
                return null;
            }
            const news = newsModel.map((newsORM) => newsORM.toNews());
            if (news[0] === undefined) {
                console.log('Not found!');
                return null;
            }
            return news[0];
        });
    }
    // Admin
    listAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const newsModels = yield this.newsRepoORM.find({ order: { id: "DESC" } });
            const news = newsModels.map((newsORM) => newsORM.toNews());
            return news;
        });
    }
    byIDAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsModel = yield this.newsRepoORM.findOneBy({ id });
            if (newsModel === null) {
                console.log('Not found!');
                return null;
            }
            return newsModel.toNews();
        });
    }
    register(news) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsToRegister = new NewsORM().fromNews(news);
            const newNewsORM = yield this.newsRepoORM.save(newsToRegister);
            if (newNewsORM === null) {
                return null;
            }
            return newNewsORM.toNews();
        });
    }
    update(news) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsModel = yield this.newsRepoORM.findOneBy({ id: news.id });
            if (newsModel === null) {
                console.log('Not found!');
                return null;
            }
            let news_to_send = new NewsORM().fromNews(news);
            const updatedNews = yield this.newsRepoORM.save(news_to_send);
            return updatedNews.toNews();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield this.newsRepoORM.delete(id);
            return (deleteResult.affected != null && deleteResult.affected != undefined) ? deleteResult.affected > 0 : false;
        });
    }
    // News Stuff
    existSeoUrl(seo_url, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificación pa Registro, no debo excluir el propio id del registro a diferencia del Update por eso envio id=0
            if (id == 0) {
                /* console.log("existSeoUrl Registrar");*/
                const news = yield this.newsRepoORM.count({
                    where: {
                        seo_url: seo_url
                    },
                });
                // Si no se contraron registros se devuelve false porque nadie más tiene ese seo_url
                if (news == 0) {
                    return false;
                }
                return true;
            }
            /* console.log("existSeoUrl Update");*/
            // Verificación pa Update, verifico que no se busque también al regitro original en caso no se haya actualizado el seo_url
            const news = yield this.newsRepoORM.count({
                where: {
                    seo_url: seo_url,
                    id: (0, typeorm_1.Not)(id),
                },
            });
            // Si no se contraron registros se devuelve false porque nadie más tiene ese seo_url
            if (news == 0) {
                return false;
            }
            return true;
        });
    }
    // News Content
    hasNewsContent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificación pa Eliminar, no se debe eliminar una Noticia que tenga minimo un componente registrado
            const news_contents = yield this.newsContentRepoORM.count({
                where: {
                    news_id: id,
                },
            });
            // Si no se contraron registros se devuelve false
            if (news_contents === 0) {
                return false;
            }
            return true;
        });
    }
    // RSS News
    listLastNews() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const newsModel = yield this.newsRepoORM.find({
                where: [
                    { status: true, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                    { status: true, publish_date: (0, typeorm_1.IsNull)() }
                ],
                order: {
                    id: "DESC",
                },
                take: 10,
            });
            if (newsModel === null) {
                console.log('Not found!');
                return null;
            }
            const news = newsModel.map((newsORM) => newsORM.toNews());
            return news;
        });
    }
    // Search
    search4News(wordsToSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            let string_concat = "";
            let string_concat_end = "";
            let arrayLikeTitulo = "";
            let arrayLikeSubTitulo = "";
            wordsToSearch.forEach((word, index) => {
                string_concat = "titulo like '%" + word + "%' OR ";
                string_concat_end = "titulo like '%" + word + "%'";
                if (index !== wordsToSearch.length - 1) {
                    arrayLikeTitulo = arrayLikeTitulo + '' + string_concat;
                }
                else {
                    arrayLikeTitulo = arrayLikeTitulo + '' + string_concat_end;
                }
                string_concat = "subtitulo like '%" + word + "%' OR ";
                string_concat_end = "subtitulo like '%" + word + "%'";
                if (index !== wordsToSearch.length - 1) {
                    arrayLikeSubTitulo = arrayLikeSubTitulo + '' + string_concat;
                }
                else {
                    arrayLikeSubTitulo = arrayLikeSubTitulo + '' + string_concat_end;
                }
            });
            let arrayLike = "(( " + arrayLikeTitulo + " ) OR (" + arrayLikeSubTitulo + " )) AND (( status = 1 AND Date(publish_date) <= Date(Now()) ) OR ( status = 1 AND publish_date IS NULL)) ";
            const now = new Date();
            const news_found = yield this.newsRepoORM.find({
                where: {
                    titulo: (0, typeorm_1.Raw)((alias) => `${arrayLike}`)
                }
            });
            /* console.log("news_found");
            console.log(news_found); */
            // Genero Array con los IDs de las noticias de las que se encontró en su titulo o subtitulo minimo un resultado,
            // para poder filtrar las noticias en las que no se tuvieron resultados, para poder revisar sus NewsContent en caso se encuentre algo
            let array_ids_news = [];
            news_found.forEach((news, index) => {
                array_ids_news.push(news.id);
            });
            //console.log(array_ids_news)
            // Listado de noticias donde no se tuvieron resultados en su titulo o subtitulo para revisar sus NewsContent sucesivamente
            // En caso que en ninguna noticia se haya encontrado resultados (array_ids_news.length == 0), se buscas los newsContent en todos las News        
            const news_with_news_content_to_check_found = array_ids_news.length == 0 ?
                yield this.newsRepoORM.find() :
                yield this.newsRepoORM.find({
                    where: {
                        id: (0, typeorm_1.Not)((0, typeorm_1.In)([array_ids_news])),
                    }
                });
            /* console.log("news_with_news_content_to_check_found");
            console.log(news_with_news_content_to_check_found); */
            // Del resultado de news_with_news_content_to_check_found genero un Array con los ids de las news pa checkear sus NEWS content
            let array_ids_news_with_news_content_to_check_found = [];
            news_with_news_content_to_check_found.forEach((news, index) => {
                array_ids_news_with_news_content_to_check_found.push(news.id);
            });
            /* console.log("array_ids_news_with_news_content_to_check_found");
            console.log(array_ids_news_with_news_content_to_check_found); */
            //const news_content_to_check = await this.newsContentRepoORM.listByNewsIdContentTipoTexto(array_ids_news_with_news_content_to_check_found)
            // Obtengo todos los newsContent de tipo 1 pertenecientes a las noticias dentro array_ids_news_with_news_content_to_check_found
            const newsContentModels = yield this.newsContentRepoORM.find({
                where: {
                    news_id: (0, typeorm_1.In)(array_ids_news_with_news_content_to_check_found),
                    tipo: 1
                },
            });
            /* console.log("newsContentModels");
            console.log(newsContentModels); */
            // Array con los ids de las news pa checkear sus NEWS content lo vació pa simplemente reciclar la variable, en esta
            // ingreso todos los news_id de las noticias a chequear sus NEWS content 
            array_ids_news_with_news_content_to_check_found = [];
            newsContentModels.forEach((news_content, index) => {
                array_ids_news_with_news_content_to_check_found.push(news_content.news_id);
            });
            /* console.log("array_ids_news_with_news_content_to_check_found");
            console.log(array_ids_news_with_news_content_to_check_found); */
            // Creo filtro pal contenido de texto de lso news content
            let arrayLikeContenido = "";
            wordsToSearch.forEach((word, index) => {
                string_concat = "contenido like '%" + word + "%' OR ";
                string_concat_end = "contenido like '%" + word + "%'";
                if (index !== wordsToSearch.length - 1) {
                    arrayLikeContenido = arrayLikeContenido + '' + string_concat;
                }
                else {
                    arrayLikeContenido = arrayLikeContenido + '' + string_concat_end;
                }
            });
            arrayLike = "( " + arrayLikeContenido + " )";
            // Obtengo los news content con la query en el contenido y el news_id del news_content que pertenezca al array array_ids_news_with_news_content_to_check_found
            const news_content_found = yield this.newsContentRepoORM.find({
                where: {
                    contenido: (0, typeorm_1.Raw)((alias) => `${arrayLike}`),
                    news_id: (0, typeorm_1.In)(array_ids_news_with_news_content_to_check_found)
                }
            });
            /* console.log("news_content_found");
            console.log(news_content_found); */
            // Obtengo los news_id de lso news_content
            // Array con los ids de las news en las que sus NEWS content tienen resultados
            let array_ids_news_with_news_content_with_content = [];
            news_content_found.forEach((news_content, index) => {
                array_ids_news_with_news_content_with_content.push(news_content.news_id);
            });
            /* console.log("array_ids_news_with_news_content_with_content");
            console.log(array_ids_news_with_news_content_with_content); */
            // Obtengo entonces las news a las que pertenecen mis NewsContent que tienen resultados
            const news_extra_with_result_in_news_content_found = yield this.newsRepoORM.find({
                where: [
                    { id: (0, typeorm_1.In)(array_ids_news_with_news_content_with_content), status: true, publish_date: (0, typeorm_1.LessThanOrEqual)(now) },
                    { id: (0, typeorm_1.In)(array_ids_news_with_news_content_with_content), status: true, publish_date: (0, typeorm_1.IsNull)() }
                ],
            });
            /* console.log("news_extra_with_result_in_news_content_found");
            console.log(news_extra_with_result_in_news_content_found); */
            let news_found_aux = news_found;
            let cant_titulo = 0;
            let cant_subtitulo = 0;
            news_found_aux.forEach((ad, index) => {
                cant_titulo = 0;
                cant_subtitulo = 0;
                wordsToSearch.forEach((word, index) => {
                    if (ad.titulo.toUpperCase().indexOf(word.toUpperCase()) > -1) {
                        cant_titulo++;
                    }
                    if (ad.subtitulo.toUpperCase().indexOf(word.toUpperCase()) > -1) {
                        cant_subtitulo++;
                    }
                });
                ad.cant_titulo = cant_titulo;
                ad.cant_subtitulo = cant_subtitulo;
                ad.sum_words = cant_titulo + cant_subtitulo;
            });
            news_found_aux.sort((a, b) => b.sum_words - a.sum_words);
            news_found_aux.forEach(function (movie, index) {
                movie.rank = index + 1;
            });
            return [{
                    // Retorno dividio en dos las noticias, en news las noticias que tienen resultados en sus propiedades, y en news_with_news_content
                    // las que tienen resultados solo en sus news_content
                    news: news_found_aux,
                    news_with_news_content: news_extra_with_result_in_news_content_found
                }];
        });
    }
}
exports.ORMNewsRepository = ORMNewsRepository;
