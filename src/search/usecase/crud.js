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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCRUDUC = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const ruta_json_words_to_ignore = __dirname.replace("src\\search\\usecase", "").replace("src/search/usecase", "") + (os_1.default.platform() === "linux" ? "src/assets/search_json_stuff/stopwords_spanish.json" : "src\\assets\\search_json_stuff\\stopwords_spanish.json");
const ruta_json_words_to_ignore2 = __dirname.replace("src\\search\\usecase", "").replace("src/search/usecase", "") + (os_1.default.platform() === "linux" ? "src/assets/search_json_stuff/stopwords_spanish2.json" : "src\\assets\\search_json_stuff\\stopwords_spanish2.json");
class SearchCRUDUC {
    constructor(adRepo, artistaRepo, eventRepo, newsRepo, newsContentRepo, podcastEpisodeRepo, podcastRepo, tipoEntradaRepo) {
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
    search(search_string /* , array_labels: String[] */) {
        return __awaiter(this, void 0, void 0, function* () {
            // Palabras del search_string a consideracion para la busqueda
            let wordsToSearch = [];
            // Palabras que filtrar que vienen del Json de palabras a ignorar
            let wordsToIgnore = [];
            try {
                // Note that jsonString will be a <Buffer> since we did not specify an
                // encoding type for the file. But it'll still work because JSON.parse() will
                // use <Buffer>.toString().
                const jsonString = fs_1.default.readFileSync(ruta_json_words_to_ignore, "utf8");
                const jsonStringAux = JSON.parse(jsonString);
                wordsToIgnore = jsonStringAux.words;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error interno, no se pudo realizar el proceso de busqueda, intente de nuevo.");
            }
            // Palabras del search_string ya separadas
            let words_search_string = search_string.split(" ");
            words_search_string.forEach((palabra) => {
                if (!wordsToIgnore.includes(palabra)) {
                    wordsToSearch.push(palabra);
                }
            });
            //let ads:any[] = [];
            //let artistas:any[] = [];
            let events = [];
            let news = [];
            let podcasts_episodes = [];
            let podcasts = [];
            try {
                //ads = await this.search4Ads(wordsToSearch)
                //artistas = await this.search4Artista(wordsToSearch)
                events = yield this.search4Events(wordsToSearch);
                news = yield this.search4News(wordsToSearch);
                podcasts_episodes = yield this.search4PodcastEpisodes(wordsToSearch);
                podcasts = yield this.search4Podcasts(wordsToSearch);
            }
            catch (error) {
                console.log(error);
                throw new Error("Error interno, no se pudo realizar la busqueda correctamente, intente de nuevo.");
            }
            return {
                // Solo retorno las palabras a buscar mediante Events, con los otros modulos no para enviarlo al FrontEnd
                words_to_search: events != null ? events[0].words_to_search : null,
                //ads: ads,
                //artistas: artistas,
                events: events[0].events,
                // Retorno dividio en dos las noticias, en news las noticias que tienen resultados en sus propiedades, y en news_with_news_content
                // las que tienen resultados solo en sus news_content
                news: news != null ? news[0].news : null,
                news_with_news_content: news != null ? news[0].news_with_news_content : null,
                podcasts_episodes: podcasts_episodes,
                podcasts: podcasts,
            };
        });
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
    search4Events(wordsToSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eventRepo.search4Events(wordsToSearch);
        });
    }
    // NEWS
    search4News(wordsToSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.newsRepo.search4News(wordsToSearch);
        });
    }
    // PODCAST EPISODES 
    search4PodcastEpisodes(wordsToSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.podcastEpisodeRepo.search4PodcastEpisodes(wordsToSearch);
        });
    }
    // PODCAST
    search4Podcasts(wordsToSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.podcastRepo.search4Podcasts(wordsToSearch);
        });
    }
}
exports.SearchCRUDUC = SearchCRUDUC;
