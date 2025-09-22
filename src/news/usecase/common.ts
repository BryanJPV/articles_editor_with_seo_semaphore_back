import { News, NewsCommonUsecase, NewsRepository } from "../../domain/news"
import { NewsContent, NewsContentRepository } from "../../domain/news_content";

export class NewsCommonUC implements NewsCommonUsecase {
    newsRepo: NewsRepository;
    newsContentRepo: NewsContentRepository;

    constructor(newsRepo: NewsRepository, newsContentRepo: NewsContentRepository) {
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
    }

    async list() : Promise<News[]> {
        let newsList = await this.newsRepo.list();
        if(newsList.length == 0 || newsList == null || newsList == undefined) {
            return [];
        }
        for (const item of newsList) {
            if (!item) continue;

            let newsContentList:NewsContent[] = await this.newsContentRepo.listByNewsId(item.id);
            item.news_content = newsContentList;
        }
        return newsList
    }
    async listByPagination(inicio:number, cantidad: number) : Promise<News[]> {
        let newsList = await this.newsRepo.listByPagination(inicio,cantidad);
        if(newsList.length == 0 || newsList == null || newsList == undefined) {
            return [];
        }

        for (const item of newsList) {
            if (!item) continue;

            let newsContentList:NewsContent[] = await this.newsContentRepo.listByNewsId(item.id);
            item.news_content = newsContentList;
        }
        return newsList
    }
    async byID(id: number) : Promise<News | null> {
        let news = await this.newsRepo.byID(id)
        if (news == null) {
            throw new Error("No se encontró la Noticia.");
        }

        let newsContentList = await this.newsContentRepo.listByNewsId(news.id);
        news.news_content = newsContentList;

        return news
    }
    async bySeoURL(seoURL: string) : Promise<News | null> {
        let news = await this.newsRepo.bySeoURL(seoURL)
        if (news == null) {
            throw new Error("No se encontró la Noticia.");
        }

        let newsContentList = await this.newsContentRepo.listByNewsId(news.id);
        news.news_content = newsContentList;

        return news
    }
}