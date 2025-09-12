"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsContent = void 0;
class NewsContent {
    constructor() {
        this.id = 0;
        this.position = 0;
        this.tipo = 0;
        this.contenido = "";
        this.descripcion = "";
        this.news_id = 0;
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}
exports.NewsContent = NewsContent;
