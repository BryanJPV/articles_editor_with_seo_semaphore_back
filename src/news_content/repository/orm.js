"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ORMNewsContentRepository = exports.NewsContentORM = void 0;
const news_content_1 = require("../../domain/news_content");
const typeorm_1 = require("typeorm");
const orm_1 = require("../../news/repository/orm");
let NewsContentORM = class NewsContentORM {
    toNewsContent() {
        let newsContent = new news_content_1.NewsContent();
        newsContent.id = this.id;
        newsContent.position = this.position;
        newsContent.tipo = this.tipo;
        newsContent.contenido = this.contenido;
        newsContent.descripcion = this.descripcion;
        newsContent.news_id = this.news_id;
        newsContent.created_at = this.createdAt; //.toDateString();
        newsContent.updated_at = this.updatedAt; //.toDateString();
        return newsContent;
    }
    fromNewsContent(newsContent) {
        this.id = newsContent.id;
        this.position = newsContent.position;
        this.tipo = newsContent.tipo;
        this.contenido = newsContent.contenido;
        this.descripcion = newsContent.descripcion;
        this.news_id = newsContent.news_id;
        return this;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true })
], NewsContentORM.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false })
], NewsContentORM.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false })
], NewsContentORM.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, /* default: "" */ })
], NewsContentORM.prototype, "contenido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, /*  default: "" */ })
], NewsContentORM.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orm_1.NewsORM, newsOrm => newsOrm.newsContent),
    (0, typeorm_1.JoinColumn)({ name: 'news_id' })
], NewsContentORM.prototype, "news", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true })
], NewsContentORM.prototype, "news_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], NewsContentORM.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)()
], NewsContentORM.prototype, "updatedAt", void 0);
NewsContentORM = __decorate([
    (0, typeorm_1.Entity)("news_content")
], NewsContentORM);
exports.NewsContentORM = NewsContentORM;
class ORMNewsContentRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.newsRepoORM = this.dataSource.getRepository(orm_1.NewsORM);
        this.newsContentRepoORM = this.dataSource.getRepository(NewsContentORM);
    }
    listByNewsId(news_id_to_list) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsContentModels = yield this.newsContentRepoORM.find({
                where: {
                    news_id: news_id_to_list
                },
                order: { id: "DESC" }
            });
            const news_content = newsContentModels.map((newsContentORM) => newsContentORM.toNewsContent());
            return news_content;
        });
    }
    byID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsContentModels = yield this.newsContentRepoORM.findOneBy({ id });
            if (newsContentModels === null) {
                console.log('Not found!');
                return null;
            }
            return newsContentModels.toNewsContent();
        });
    }
    register(newsContent, news_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let newsContentToRegister = new NewsContentORM().fromNewsContent(newsContent);
            newsContentToRegister.news_id = news_id;
            const newNewsContentORM = yield this.newsContentRepoORM.save(newsContentToRegister);
            if (newNewsContentORM === null) {
                return null;
            }
            return newNewsContentORM.toNewsContent();
        });
    }
    update(newsContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsContentModel = yield this.newsContentRepoORM.findOneBy({ id: newsContent.id });
            if (newsContentModel === null) {
                console.log('Not found!');
                return null;
            }
            let news_to_send = new NewsContentORM().fromNewsContent(newsContent);
            const updatedNewsContent = yield this.newsContentRepoORM.save(news_to_send);
            return updatedNewsContent.toNewsContent();
        });
    }
    delete(news_content_id_to_delete) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield this.newsContentRepoORM.delete(news_content_id_to_delete);
            return (deleteResult.affected != null && deleteResult.affected != undefined) ? deleteResult.affected > 0 : false;
        });
    }
}
exports.ORMNewsContentRepository = ORMNewsContentRepository;
