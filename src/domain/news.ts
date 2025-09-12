import { NewsContent } from "./news_content";

export class News {
    id: number;
    titulo: string;
    subtitulo: string;
    seo_url: string;
    img_url: string;
    keywords: string;
    status: boolean;
    publish_date: Date;
    created_at: Date;
    updated_at: Date;
    news_content:  NewsContent[];

    constructor () {
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

export interface NewsRepository {
    // Common
    list() : Promise<News[]>;
    listByPagination(inicio:number, cantidad: number) : Promise<News[]>;
    byID(id: number) : Promise<News | null>;
    bySeoURL(seo_url_to_search: string) : Promise<News | null>;

    // Admin
    listAdmin() : Promise<News[]>;
    byIDAdmin(id: number) : Promise<News | null>;
    register(news: News) : Promise<News | null>;
    update(news: News) : Promise<News | null>;
    delete(id: number) : Promise<boolean>;

    // News Stuff
    existSeoUrl(seo_url: string, id: number) : Promise<boolean>;

    // News Content
    hasNewsContent(id: number) : Promise<boolean>;

/*     // RSS News
    listLastNews() : Promise<News[] | null>;

    // Podcast Articles
    listUnlinkedNewsByPodcastId(podcastId: number) : Promise<News[]>;
    newsByPodcastID(podcastId: number) : Promise<News[]>; */

    // Search
    search4News(wordsToSearch: string[]) : Promise<any[]>;
}

export interface NewsAdminUsecase {
    list() : Promise<News[]>;
    byID(id: number) : Promise<News | null>;

    register(news: News) : Promise<News | null>;
    update(news: News, img_url_old_cropped:boolean) : Promise<News | null>;
    delete(id: number) : Promise<boolean>;
}

export interface NewsCommonUsecase {
    list() : Promise<News[]>;
    listByPagination(inicio:number, cantidad: number) : Promise<News[]>;
    byID(id: number) : Promise<News | null>;
    bySeoURL(seo_url_to_search: string) : Promise<News | null>;
}