"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
class News {
    constructor() {
        this.id = 0;
        this.titulo = "";
        this.subtitulo = "";
        this.seo_url = "";
        this.img_url = "";
        this.keywords = "";
        this.status = false;
        this.publish_date = new Date();
        this.created_at = new Date();
        this.updated_at = new Date();
        this.news_content = [];
    }
}
exports.News = News;
