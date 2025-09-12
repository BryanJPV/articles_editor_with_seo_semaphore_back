import { NewsContent, NewsContentRepository } from "../../domain/news_content"
import { DataSource,Entity, PrimaryGeneratedColumn, Column, ManyToOne, Repository, UpdateDateColumn, CreateDateColumn, JoinColumn, In } from "typeorm"
import { NewsORM } from "../../news/repository/orm"

@Entity("news_content")
export class NewsContentORM {
    @PrimaryGeneratedColumn({ unsigned: true })
    declare id: number

    @Column({ type: "tinyint", nullable: false })
    declare position: number
    @Column({ type: "tinyint", nullable: false })
    declare tipo: number
    @Column({ type: "text", nullable: true, /* default: "" */ })
    declare contenido: string
    @Column({ type: "text",  nullable: true,/*  default: "" */ })
    declare descripcion: string

    @ManyToOne(() => NewsORM, newsOrm => newsOrm.newsContent)
    @JoinColumn({ name: 'news_id' })
    declare news: NewsORM
    @Column({ type: 'int', unsigned: true })
    declare news_id: number;

    @CreateDateColumn()
    declare createdAt: Date
    @UpdateDateColumn()
    declare updatedAt: Date

    toNewsContent() : NewsContent {
        let newsContent = new NewsContent();

        newsContent.id = this.id;
        newsContent.position = this.position;
        newsContent.tipo = this.tipo;
        newsContent.contenido = this.contenido;
        newsContent.descripcion = this.descripcion;
        newsContent.news_id = this.news_id;
        newsContent.created_at = this.createdAt//.toDateString();
        newsContent.updated_at = this.updatedAt//.toDateString();

        return newsContent;
    }

    fromNewsContent(newsContent: NewsContent) {
        this.id = newsContent.id;
        this.position = newsContent.position;
        this.tipo = newsContent.tipo;
        this.contenido = newsContent.contenido;
        this.descripcion = newsContent.descripcion;
        this.news_id = newsContent.news_id;

        return this;
    }
}

export class ORMNewsContentRepository implements NewsContentRepository{
    dataSource: DataSource;
    newsRepoORM: Repository<NewsORM>;
    newsContentRepoORM: Repository<NewsContentORM>;

    constructor (dataSource: DataSource) {
        this.dataSource = dataSource;
        this.newsRepoORM = this.dataSource.getRepository(NewsORM);
        this.newsContentRepoORM = this.dataSource.getRepository(NewsContentORM);
    }

    async listByNewsId(news_id_to_list:number) : Promise<NewsContent[]>{
        const newsContentModels = await this.newsContentRepoORM.find({
            where: {
                news_id: news_id_to_list
            },
            order: { id: "DESC" }
        });

        const news_content: NewsContent[] = newsContentModels.map((newsContentORM: NewsContentORM) => newsContentORM.toNewsContent() );

        return news_content;
    }

    async byID(id: number) : Promise<NewsContent | null>{
        const newsContentModels = await this.newsContentRepoORM.findOneBy({ id });

        if (newsContentModels === null) {
            console.log('Not found!');
            return null;
        }

        return newsContentModels.toNewsContent();
    }


    async register(newsContent: NewsContent, news_id: number) : Promise<NewsContent | null>{
        let newsContentToRegister: NewsContentORM = new NewsContentORM().fromNewsContent(newsContent);
        newsContentToRegister.news_id = news_id;

        const newNewsContentORM = await this.newsContentRepoORM.save(newsContentToRegister);

        if (newNewsContentORM === null) {
            return null
        }

        return newNewsContentORM.toNewsContent();
    }
    async update(newsContent: NewsContent) : Promise<NewsContent | null>{
        const newsContentModel = await this.newsContentRepoORM.findOneBy({id: newsContent.id});

        if (newsContentModel === null) {
            console.log('Not found!');
            return null;
        }
        
        let news_to_send = new NewsContentORM().fromNewsContent(newsContent);

        const updatedNewsContent = await this.newsContentRepoORM.save(news_to_send);

        return updatedNewsContent.toNewsContent();
    }
    async delete(news_content_id_to_delete: number) : Promise<boolean>{
        const deleteResult = await this.newsContentRepoORM.delete(news_content_id_to_delete);
        return (deleteResult.affected != null && deleteResult.affected != undefined) ? deleteResult.affected > 0 : false;
    }
}