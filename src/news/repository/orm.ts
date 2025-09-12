import { News, NewsRepository } from "../../domain/news"
import { DataSource,Entity, PrimaryGeneratedColumn, Column, OneToMany, Repository, UpdateDateColumn, CreateDateColumn, Not, Raw, In, LessThanOrEqual, IsNull } from "typeorm"
import { NewsContentORM } from "../../news_content/repository/orm"
import { PodcastArticlesORM } from "../../podcasts/repository/orm"

@Entity("news")
export class NewsORM {
    @PrimaryGeneratedColumn({ unsigned: true })
    declare id: number

    @Column({ type: "varchar", length: 150, nullable: false })
    declare titulo: string
    @Column({ type: "varchar", length: 250, nullable: false })
    declare subtitulo: string
    @Column({ type: "varchar", length: 200, nullable: false })
    declare seo_url: string
    @Column({ type: "varchar", length: 200, nullable: false })
    declare img_url: string

    @Column({ type: "varchar", length: 200, nullable: false })
    declare keywords: string
    @Column({ type: "boolean", nullable: false, default: true })
    declare status: boolean
    @Column({ type: "datetime", nullable: true })
    declare publish_date: Date

    @CreateDateColumn()
    declare createdAt: Date
    @UpdateDateColumn()
    declare updatedAt: Date

    @OneToMany(() => NewsContentORM, newsContent => newsContent.news)
    declare newsContent: NewsContentORM[]

    toNews() : News {
        let news = new News();
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

    fromNews(news: News) {
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
}

export class ORMNewsRepository implements NewsRepository{
    dataSource: DataSource;
    newsRepoORM: Repository<NewsORM>;
    newsContentRepoORM: Repository<NewsContentORM>;
    podcastArticlesRepoORM: Repository<PodcastArticlesORM>;
    
    constructor (dataSource: DataSource) {
        this.dataSource = dataSource;
        this.newsRepoORM = this.dataSource.getRepository(NewsORM);
        this.newsContentRepoORM = this.dataSource.getRepository(NewsContentORM);
        this.podcastArticlesRepoORM = this.dataSource.getRepository(PodcastArticlesORM);
    }

    // Common
    async list() : Promise<News[]>{
        const now = new Date();
        const newsModels = await this.newsRepoORM.find({
            where: [ // OR
                { status: true, publish_date: LessThanOrEqual(now) },
                { status: true, publish_date: IsNull() }
            ],
            order: { publish_date: "DESC" }
        });
        const news: News[] = newsModels.map((newsORM: NewsORM) => newsORM.toNews());
        return news;
    }
    async listByPagination(inicio:number, cantidad: number) : Promise<News[]>{
        const now = new Date();
        if(cantidad > 0 && inicio > 0){
            const newsModels = await this.newsRepoORM.find({
                where: [ // OR
                    { status: true, publish_date: LessThanOrEqual(now) },
                    { status: true, publish_date: IsNull() }
                ],
                order: { 
                    publish_date: "DESC" 
                },
                skip: inicio,
                take: cantidad,
            });
            const news: News[] = newsModels.map((newsORM: NewsORM) => newsORM.toNews());
            return news;
        }
        if(cantidad > 0 && inicio === 0){
            const newsModels = await this.newsRepoORM.find({
                where: [ // OR
                    { status: true, publish_date: LessThanOrEqual(now) },
                    { status: true, publish_date: IsNull() }
                ],
                order: { 
                    publish_date: "DESC" 
                },
                skip: 0,
                take: cantidad,
            });
            const news: News[] = newsModels.map((newsORM: NewsORM) => newsORM.toNews());
            return news;
        }
        return []
    }
    async byID(id: number) : Promise<News | null>{
        const now = new Date();
        const newsModel = await this.newsRepoORM.find({
            where: [ // OR
                { id: id, publish_date: LessThanOrEqual(now) },
                { id: id, publish_date: IsNull() }
            ],
        });

        if (newsModel[0] === null) {
            console.log('Not found!');
            return null;
        }

        if (!newsModel[0].status) {
            console.log('Not found!');
            return null;
        }

        return newsModel[0].toNews();
    }

    async bySeoURL(seo_url_to_search: string) : Promise<News | null>{
        const now = new Date();
        const newsModel = await this.newsRepoORM.find({
            where: [ // OR
                { seo_url: seo_url_to_search, status: true, publish_date: LessThanOrEqual(now) },
                { seo_url: seo_url_to_search, status: true, publish_date: IsNull() }
            ],
        });

        if (newsModel === null) {
            console.log('Not found!');
            return null;
        }
        const news: News[] = newsModel.map((newsORM: NewsORM) => newsORM.toNews());
        return news[0];
    }

    // Admin
    async listAdmin() : Promise<News[]>{
        const newsModels = await this.newsRepoORM.find({ order: { id: "DESC" } });
        const news: News[] = newsModels.map((newsORM: NewsORM) => newsORM.toNews());
        return news;
    }
    async byIDAdmin(id: number) : Promise<News | null>{
        const newsModel = await this.newsRepoORM.findOneBy({id});

        if (newsModel === null) {
            console.log('Not found!');
            return null;
        }

        return newsModel.toNews();
    }
    async register(news: News) : Promise<News | null> {
        const newsToRegister: NewsORM = new NewsORM().fromNews(news);
        const newNewsORM = await this.newsRepoORM.save(newsToRegister);

        if (newNewsORM === null) {
            return null
        }

        return newNewsORM.toNews();
    }
    
    async update(news: News) : Promise<News | null>{
        const newsModel = await this.newsRepoORM.findOneBy({id: news.id});

        if (newsModel === null) {
            console.log('Not found!');
            return null;
        }

        let news_to_send = new NewsORM().fromNews(news);

        const updatedNews = await this.newsRepoORM.save(news_to_send);

        return updatedNews.toNews();
    }
    async delete(id: number) : Promise<boolean>{
        const deleteResult = await this.newsRepoORM.delete(id);
        return (deleteResult.affected != null && deleteResult.affected != undefined) ? deleteResult.affected > 0 : false;
    }


    // News Stuff
    async existSeoUrl(seo_url: string, id: number) : Promise<boolean>{
        // Verificación pa Registro, no debo excluir el propio id del registro a diferencia del Update por eso envio id=0
        if(id == 0){
            /* console.log("existSeoUrl Registrar");*/
            const news = await this.newsRepoORM.count({
                where: {
                    seo_url: seo_url
                },
            });
            // Si no se contraron registros se devuelve false porque nadie más tiene ese seo_url
            if(news == 0){
                return false;
            }     
            return true;
        } 
        
        /* console.log("existSeoUrl Update");*/
        // Verificación pa Update, verifico que no se busque también al regitro original en caso no se haya actualizado el seo_url
        const news = await this.newsRepoORM.count({
            where: {
                seo_url: seo_url,
                id: Not(id),
            },
        });
        // Si no se contraron registros se devuelve false porque nadie más tiene ese seo_url
        if(news == 0){
            return false;
        }     
        return true;
    }

    // News Content
    async hasNewsContent(id: number) : Promise<boolean>{
        // Verificación pa Eliminar, no se debe eliminar una Noticia que tenga minimo un componente registrado
        const news_contents = await this.newsContentRepoORM.count({
            where: {
                news_id: id,
            },
        });
        
        // Si no se contraron registros se devuelve false
        if(news_contents === 0){
            return false;
        }     
        return true;
    }

    // RSS News
    async listLastNews() : Promise<News[] | null>{
        const now = new Date();
        const newsModel = await this.newsRepoORM.find({
            where: [ // OR
                { status: true, publish_date: LessThanOrEqual(now) },
                { status: true, publish_date: IsNull() }
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
        const news: News[] = newsModel.map((newsORM: NewsORM) => newsORM.toNews());
        return news;
    }

    // Podcast Articles
    async newsByPodcastID(podcastId: number) : Promise<News[]> {
        const podcastArticlesModels = await this.podcastArticlesRepoORM.find({
            where: { podcast_id: podcastId },
            relations: { news: true },
            order: { news_id: "DESC" },
        });
        const news: News[] = podcastArticlesModels.map((podcastArticles) => podcastArticles.news.toNews())
        return news;
    }
    
    async listUnlinkedNewsByPodcastId(podcastId: number) : Promise<News[]>{
        const podcastArticlesModels = await this.podcastArticlesRepoORM.find({ 
            where: {
                podcast_id: podcastId
            }
        });
        if (podcastArticlesModels === null) {
            console.log('Not found!');
            return [];
        }

        let array_ids_news_already_linked:number[] = [];
        podcastArticlesModels.forEach((podcast_article:any) => {
            array_ids_news_already_linked.push(podcast_article.news_id);
        })
        console.log(array_ids_news_already_linked);
        
        const newsModels = await this.newsRepoORM.find({ 
            where: {
                id: Not(In(array_ids_news_already_linked))
            },
            order: {
                id: "DESC",
            },
        });
        const news: News[] = newsModels.map((newsORM: NewsORM) => newsORM.toNews())
        return news;
    }


    // Search
    async search4News(wordsToSearch: string[]) : Promise<any[]> {
        let string_concat:string = "";
        let string_concat_end:string = "";
        let arrayLikeTitulo:string = "";
        let arrayLikeSubTitulo:string = "";
        wordsToSearch.forEach((word:string, index) => {
            string_concat = "titulo like '%" + word + "%' OR ";
            string_concat_end = "titulo like '%" + word + "%'";
            if(index !== wordsToSearch.length - 1){
                arrayLikeTitulo = arrayLikeTitulo + '' + string_concat
            } else {
                arrayLikeTitulo = arrayLikeTitulo + '' + string_concat_end
            }

            string_concat = "subtitulo like '%" + word + "%' OR ";
            string_concat_end = "subtitulo like '%" + word + "%'";

            if(index !== wordsToSearch.length - 1){
                arrayLikeSubTitulo = arrayLikeSubTitulo + '' + string_concat
            } else {
                arrayLikeSubTitulo = arrayLikeSubTitulo + '' + string_concat_end
            }
        })
        
        let arrayLike: string = "(( " + arrayLikeTitulo + " ) OR (" + arrayLikeSubTitulo + " )) AND (( status = 1 AND Date(publish_date) <= Date(Now()) ) OR ( status = 1 AND publish_date IS NULL)) ";
        
        const now = new Date();
        const news_found = await this.newsRepoORM.find({
            where: {
                titulo: Raw((alias) => `${arrayLike}`)
            }
        });
        /* console.log("news_found");
        console.log(news_found); */
        
        
        // Genero Array con los IDs de las noticias de las que se encontró en su titulo o subtitulo minimo un resultado,
        // para poder filtrar las noticias en las que no se tuvieron resultados, para poder revisar sus NewsContent en caso se encuentre algo
        let array_ids_news:number[] = [];
        news_found.forEach((news:any, index) => {
            array_ids_news.push(news.id);
        })
        //console.log(array_ids_news)
        
        // Listado de noticias donde no se tuvieron resultados en su titulo o subtitulo para revisar sus NewsContent sucesivamente
        // En caso que en ninguna noticia se haya encontrado resultados (array_ids_news.length == 0), se buscas los newsContent en todos las News        
        const news_with_news_content_to_check_found = array_ids_news.length == 0 ?
            await this.newsRepoORM.find() :
            await this.newsRepoORM.find({
                where: {
                    id: Not(In([array_ids_news])),
                }
            });
        /* console.log("news_with_news_content_to_check_found");
        console.log(news_with_news_content_to_check_found); */

        // Del resultado de news_with_news_content_to_check_found genero un Array con los ids de las news pa checkear sus NEWS content
        let array_ids_news_with_news_content_to_check_found:number[] = [];
        news_with_news_content_to_check_found.forEach((news:any, index:number) => {
            array_ids_news_with_news_content_to_check_found.push(news.id);
        })
        /* console.log("array_ids_news_with_news_content_to_check_found");
        console.log(array_ids_news_with_news_content_to_check_found); */

        //const news_content_to_check = await this.newsContentRepoORM.listByNewsIdContentTipoTexto(array_ids_news_with_news_content_to_check_found)
        // Obtengo todos los newsContent de tipo 1 pertenecientes a las noticias dentro array_ids_news_with_news_content_to_check_found
        const newsContentModels = await this.newsContentRepoORM.find({
            where: {
                news_id: In(array_ids_news_with_news_content_to_check_found),
                tipo: 1
            },
        });
        /* console.log("newsContentModels");
        console.log(newsContentModels); */

        // Array con los ids de las news pa checkear sus NEWS content lo vació pa simplemente reciclar la variable, en esta
        // ingreso todos los news_id de las noticias a chequear sus NEWS content 
        array_ids_news_with_news_content_to_check_found = [];
        newsContentModels.forEach((news_content:any, index) => {
            array_ids_news_with_news_content_to_check_found.push(news_content.news_id);
        })
        /* console.log("array_ids_news_with_news_content_to_check_found");
        console.log(array_ids_news_with_news_content_to_check_found); */
        
        // Creo filtro pal contenido de texto de lso news content
        let arrayLikeContenido:string = "";
        wordsToSearch.forEach((word:string, index) => {
            string_concat = "contenido like '%" + word + "%' OR ";
            string_concat_end = "contenido like '%" + word + "%'";
            if(index !== wordsToSearch.length - 1){
                arrayLikeContenido = arrayLikeContenido + '' + string_concat
            } else {
                arrayLikeContenido = arrayLikeContenido + '' + string_concat_end
            }
        })
        arrayLike = "( " + arrayLikeContenido + " )";
        // Obtengo los news content con la query en el contenido y el news_id del news_content que pertenezca al array array_ids_news_with_news_content_to_check_found
        const news_content_found = await this.newsContentRepoORM.find({
            where: {
                contenido: Raw((alias) => `${arrayLike}`),
                news_id: In(array_ids_news_with_news_content_to_check_found)
            }
        });
        /* console.log("news_content_found");
        console.log(news_content_found); */
        

        // Obtengo los news_id de lso news_content
        // Array con los ids de las news en las que sus NEWS content tienen resultados
        let array_ids_news_with_news_content_with_content:number[] = [];
        news_content_found.forEach((news_content:any, index) => {
            array_ids_news_with_news_content_with_content.push(news_content.news_id);
        })
        /* console.log("array_ids_news_with_news_content_with_content");
        console.log(array_ids_news_with_news_content_with_content); */


        // Obtengo entonces las news a las que pertenecen mis NewsContent que tienen resultados
        const news_extra_with_result_in_news_content_found = await this.newsRepoORM.find({
            where: [ // OR
                { id: In(array_ids_news_with_news_content_with_content), status: true, publish_date: LessThanOrEqual(now) },
                { id: In(array_ids_news_with_news_content_with_content), status: true, publish_date: IsNull() }
            ],
        });
        /* console.log("news_extra_with_result_in_news_content_found");
        console.log(news_extra_with_result_in_news_content_found); */
        

        let news_found_aux:any = news_found;
        
        let cant_titulo:number = 0;
        let cant_subtitulo:number = 0;
        news_found_aux.forEach((ad:any, index:number) => {
            cant_titulo = 0;
            cant_subtitulo = 0;
            wordsToSearch.forEach((word:string, index) => {    
                if(ad.titulo.toUpperCase().indexOf(word.toUpperCase()) > -1){
                    cant_titulo++;
                }
                if(ad.subtitulo.toUpperCase().indexOf(word.toUpperCase()) > -1){
                    cant_subtitulo++;
                }
            })
            ad.cant_titulo = cant_titulo;
            ad.cant_subtitulo = cant_subtitulo;
            ad.sum_words = cant_titulo + cant_subtitulo;
        })
        
        news_found_aux.sort((a:any, b:any) => b.sum_words - a.sum_words);
        news_found_aux.forEach(function(movie:any, index:any){
            movie.rank = index + 1;
        });
        

        return [{
            // Retorno dividio en dos las noticias, en news las noticias que tienen resultados en sus propiedades, y en news_with_news_content
            // las que tienen resultados solo en sus news_content
            news: news_found_aux,
            news_with_news_content: news_extra_with_result_in_news_content_found
        }];
    }
}