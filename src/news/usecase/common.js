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
exports.NewsCommonUC = void 0;
class NewsCommonUC {
    constructor(newsRepo, newsContentRepo) {
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            let newsList = yield this.newsRepo.list();
            for (let index = 0; index < newsList.length; index++) {
                let newsContentList = yield this.newsContentRepo.listByNewsId(newsList[index].id);
                newsList[index].news_content = newsContentList;
            }
            return newsList;
        });
    }
    listByPagination(inicio, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            let newsList = yield this.newsRepo.listByPagination(inicio, cantidad);
            if (newsList != null && newsList !== undefined) {
                for (let index = 0; index < newsList.length; index++) {
                    let newsContentList = yield this.newsContentRepo.listByNewsId(newsList[index].id);
                    newsList[index].news_content = newsContentList;
                }
                return newsList;
            }
            return [];
        });
    }
    byID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let news = yield this.newsRepo.byID(id);
            if (news == null) {
                throw new Error("No se encontró la Noticia.");
            }
            let newsContentList = yield this.newsContentRepo.listByNewsId(news.id);
            news.news_content = newsContentList;
            return news;
        });
    }
    bySeoURL(seoURL) {
        return __awaiter(this, void 0, void 0, function* () {
            let news = yield this.newsRepo.bySeoURL(seoURL);
            if (news == null) {
                throw new Error("No se encontró la Noticia.");
            }
            let newsContentList = yield this.newsContentRepo.listByNewsId(news.id);
            news.news_content = newsContentList;
            return news;
        });
    }
}
exports.NewsCommonUC = NewsCommonUC;
