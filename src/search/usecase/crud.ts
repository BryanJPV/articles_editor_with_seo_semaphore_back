import { AdRepository } from "../../domain/ads";
import { ArtistaRepository } from "../../domain/artistas";
import { EventRepository } from "../../domain/events";
import { NewsRepository } from "../../domain/news";
import { NewsContentRepository } from "../../domain/news_content";
import { PodcastEpisodeRepository } from "../../domain/podcast_episodes";
import { PodcastRepository } from "../../domain/podcasts";
import { TipoEntrada, TipoEntradaRepository } from "../../domain/tipos_entradas";

import { SearchUsecase } from "../../domain/search"

import fs from 'fs';
import Os from 'os'

const ruta_json_words_to_ignore:string = __dirname.replace("src\\search\\usecase", "").replace("src/search/usecase", "") + ( Os.platform() === "linux" ? "src/assets/search_json_stuff/stopwords_spanish.json" : "src\\assets\\search_json_stuff\\stopwords_spanish.json");
const ruta_json_words_to_ignore2:string = __dirname.replace("src\\search\\usecase", "").replace("src/search/usecase", "") + ( Os.platform() === "linux" ? "src/assets/search_json_stuff/stopwords_spanish2.json" : "src\\assets\\search_json_stuff\\stopwords_spanish2.json");

export class SearchCRUDUC implements SearchUsecase {
    artistaRepo : ArtistaRepository;
    adRepo : AdRepository;
    eventRepo: EventRepository;
    newsRepo: NewsRepository;
    newsContentRepo: NewsContentRepository;
    podcastEpisodeRepo: PodcastEpisodeRepository;
    podcastRepo: PodcastRepository;
    tipoEntradaRepo: TipoEntradaRepository;

    constructor(
        adRepo : AdRepository,
        artistaRepo: ArtistaRepository,
        eventRepo: EventRepository,
        newsRepo: NewsRepository,
        newsContentRepo: NewsContentRepository,
        podcastEpisodeRepo: PodcastEpisodeRepository,
        podcastRepo: PodcastRepository,
        tipoEntradaRepo: TipoEntradaRepository
    ) {
        this.adRepo = adRepo;
        this.artistaRepo = artistaRepo;
        this.eventRepo = eventRepo;
        this.newsRepo = newsRepo;
        this.newsContentRepo = newsContentRepo;
        this.podcastEpisodeRepo = podcastEpisodeRepo;
        this.podcastRepo = podcastRepo;
        this.tipoEntradaRepo = tipoEntradaRepo;
    }

    /* async sort_words() : Promise<any[] | null> {
        // Palabras del search_string a consideracion para la busqueda
        let wordsToSearch:string[] = [];
        // Palabras que filtrar que vienen del Json de palabras a ignorar
        let wordsToIgnore:any[] = [];
        try {
            // Note that jsonString will be a <Buffer> since we did not specify an
            // encoding type for the file. But it'll still work because JSON.parse() will
            // use <Buffer>.toString().
            const jsonString = fs.readFileSync(ruta_json_words_to_ignore, "utf8");
            console.log(jsonString);
            
            const jsonStringAux:any = JSON.parse(jsonString);
            console.log(jsonStringAux);

            wordsToIgnore = jsonStringAux.words;
            console.log(wordsToIgnore);
            console.log("wordsToIgnore.sort()");
            console.log(wordsToIgnore.sort());

            let objetoToSave: any = {
                words: wordsToIgnore.sort()
            }

            fs.writeFile(ruta_json_words_to_ignore2, JSON.stringify(objetoToSave), err => {
                if (err) {
                    console.error(err);
                }
                // file written successfully
            });

        } catch (error:Error | any) {
            console.log(error);
            return null;
        }
        
        return null
    } */

    async search(search_string: string/* , array_labels: String[] */) : Promise<any> {
        // Palabras del search_string a consideracion para la busqueda
        let wordsToSearch:string[] = [];
        // Palabras que filtrar que vienen del Json de palabras a ignorar
        let wordsToIgnore:any[] = [];
        try {
            // Note that jsonString will be a <Buffer> since we did not specify an
            // encoding type for the file. But it'll still work because JSON.parse() will
            // use <Buffer>.toString().
            const jsonString = fs.readFileSync(ruta_json_words_to_ignore, "utf8");
            const jsonStringAux:any = JSON.parse(jsonString);
            wordsToIgnore = jsonStringAux.words;
        } catch (error:Error | any) {
            console.log(error);
            throw new Error("Error interno, no se pudo realizar el proceso de busqueda, intente de nuevo.");
        }

        // Palabras del search_string ya separadas
        let words_search_string = search_string.split(" ");
        words_search_string.forEach((palabra:string) => {
            if(!wordsToIgnore.includes(palabra)){
                wordsToSearch.push(palabra);
            }
        })

        //let ads:any[] = [];
        //let artistas:any[] = [];
        let events:any[] = [];
        let news:any[] = [];
        let podcasts_episodes:any[] = [];
        let podcasts:any[] = [];
        try {
            //ads = await this.search4Ads(wordsToSearch)
            //artistas = await this.search4Artista(wordsToSearch)
            events = await this.search4Events(wordsToSearch)
            news = await this.search4News(wordsToSearch)
            podcasts_episodes = await this.search4PodcastEpisodes(wordsToSearch)
            podcasts = await this.search4Podcasts(wordsToSearch)
        } catch (error:Error | any) {
            console.log(error);
            throw new Error("Error interno, no se pudo realizar la busqueda correctamente, intente de nuevo.");
        }

        return {
            // Solo retorno las palabras a buscar mediante Events, con los otros modulos no para enviarlo al FrontEnd
            words_to_search: events != null ? events[0].words_to_search: null,
            //ads: ads,
            //artistas: artistas,
            events: events[0].events,
            // Retorno dividio en dos las noticias, en news las noticias que tienen resultados en sus propiedades, y en news_with_news_content
            // las que tienen resultados solo en sus news_content
            news: news != null ? news[0].news: null,
            news_with_news_content: news != null ? news[0].news_with_news_content: null,
            podcasts_episodes: podcasts_episodes,
            podcasts: podcasts,
        }
    }
    
    /* 
    // ADS
    async search4Ads(wordsToSearch:string[]) : Promise<any[]> {
        return await this.adRepo.search4Ads(wordsToSearch)
    }

    // ARTISTAS
    async search4Artista(wordsToSearch:string[]) : Promise<any[]> {
        return await this.artistaRepo.search4Artista(wordsToSearch)
    } */

    // EVENTS
    async search4Events(wordsToSearch:string[]) : Promise<any[]> {
        return await this.eventRepo.search4Events(wordsToSearch)
    }

    // NEWS
    async search4News(wordsToSearch:string[]) : Promise<any[]> {
        return await this.newsRepo.search4News(wordsToSearch)
    }

    // PODCAST EPISODES 
    async search4PodcastEpisodes(wordsToSearch:string[]) : Promise<any[]> {
        return await this.podcastEpisodeRepo.search4PodcastEpisodes(wordsToSearch)
    }

    // PODCAST
    async search4Podcasts(wordsToSearch:string[]) : Promise<any[]> {
        return await this.podcastRepo.search4Podcasts(wordsToSearch)
    }
}