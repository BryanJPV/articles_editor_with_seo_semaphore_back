export class NewsContent {
    id: number;
    position: number;
    tipo: number;
    contenido: string;
    descripcion: string;
    news_id: number;
    created_at: Date;
    updated_at: Date;

    constructor () {
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

export interface NewsContentRepository {
    listByNewsId(news_id_to_list:number) : Promise<NewsContent[]>;
    byID(id: number) : Promise<NewsContent | null>;

    register(news_content: NewsContent, news_id: number) : Promise<NewsContent | null>;
    update(news_content: NewsContent) : Promise<NewsContent | null>;
    delete(id: number) : Promise<boolean>;
}

export interface NewsContentAdminUsecase {
    listByNewsId(news_id_to_list:number) : Promise<NewsContent[]>;
    byID(id: number) : Promise<NewsContent | null>;

    register(news_content: NewsContent, news_id: number) : Promise<NewsContent | null>;
    update(news_content: NewsContent, img_url_old_cropped:boolean) : Promise<NewsContent | null>;
    delete(id: number) : Promise<boolean>;
}