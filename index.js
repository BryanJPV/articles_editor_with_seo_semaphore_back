"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// decoradores en TypeScript (muy común en frameworks como TypeORM, InversifyJS, NestJS, routing-controllers, class-validator, etc.). Definir esquemas de entidades (TypeORM).
require("reflect-metadata");
require('dotenv').config();
const fs_1 = __importDefault(require("fs"));
const http_1 = require("./src/app/delivery/http");
const typeorm_1 = require("typeorm");
// NEWS
const orm_1 = require("./src/news/repository/orm");
const admin_1 = require("./src/news/delivery/admin");
const common_1 = require("./src/news/delivery/common");
const crud_1 = require("./src/news/usecase/crud");
const common_2 = require("./src/news/usecase/common");
// NEWSContent
const orm_2 = require("./src/news_content/repository/orm");
const http_2 = require("./src/news_content/delivery/http");
const crud_2 = require("./src/news_content/usecase/crud");
// Users
const orm_3 = require("./src/user/repository/orm");
const http_3 = require("./src/user/delivery/http");
const crud_3 = require("./src/user/usecase/crud");
// SEARCH
const http_4 = require("./src/search/delivery/http");
const crud_4 = require("./src/search/usecase/crud");
// SEMAFORO SEO
const http_5 = require("./src/semaforo_seo/delivery/http");
const crud_5 = require("./src/semaforo_seo/usecase/crud");
// Config
const config_1 = require("./src/config");
// Database Initialization
// INICIAR LA BD CON LA SELECCION DE DOTENV
const appDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: config_1.DB_HOST !== null && config_1.DB_HOST !== void 0 ? config_1.DB_HOST : "localhost",
    port: config_1.DB_PORT !== null && config_1.DB_PORT !== void 0 ? config_1.DB_PORT : 3306,
    username: config_1.DB_USER !== null && config_1.DB_USER !== void 0 ? config_1.DB_USER : "",
    password: config_1.DB_PASSWORD !== null && config_1.DB_PASSWORD !== void 0 ? config_1.DB_PASSWORD : "",
    database: config_1.DB_DATABASE !== null && config_1.DB_DATABASE !== void 0 ? config_1.DB_DATABASE : "articles_editor_db",
    synchronize: false, // en produccion debe ser falso, ponerlo en true solo cuando queramos migrar desde 0 la BD
    logging: true,
    entities: [
        orm_1.NewsORM,
        orm_2.NewsContentORM,
        orm_3.UserORM,
    ],
    subscribers: [],
    migrations: [],
    charset: "utf8mb4_unicode_ci",
});
// Repositories Initialization
let newsRepo = new orm_1.ORMNewsRepository(appDataSource);
let newsContentRepo = new orm_2.ORMNewsContentRepository(appDataSource);
let userRepo = new orm_3.ORMUserRepository(appDataSource);
// VERIFICAR MIGRACIÓN
// configurationRepo.migrate();
// Usecases Initialization
let newsAdminUC = new crud_1.NewsCRUDUC(newsRepo, newsContentRepo);
let newsUC = new common_2.NewsCommonUC(newsRepo, newsContentRepo);
let newsContentUC = new crud_2.NewsContentCRUDUC(newsRepo, newsContentRepo);
let userUC = new crud_3.UserCRUDUC(userRepo);
let searchUC = new crud_4.SearchCRUDUC(newsRepo, newsContentRepo);
let semaforoSeoUC = new crud_5.SemaforoSeoCRUDUC();
// API Initialization
let privateKey = fs_1.default.readFileSync('./certs/server.key', 'utf8');
let certificate = fs_1.default.readFileSync('./certs/server.crt', 'utf8');
let credentials = { key: privateKey, cert: certificate };
const port = 5000;
const httpAPI = new http_1.HttpAPI(port, /*  null */ credentials);
// HTTP Delivery Initialization
// Admin
let newsAdminHandler = new admin_1.NewsAdminHandler(newsAdminUC, userUC);
httpAPI.addAdminHandler(newsAdminHandler);
let newsContentHandler = new http_2.NewsContentHandler(newsContentUC, userUC);
httpAPI.addAdminHandler(newsContentHandler);
let userHandler = new http_3.UserHandler(userUC);
httpAPI.addAdminHandler(userHandler);
let semaforoSeoHandler = new http_5.SemaforoSeoHandler(semaforoSeoUC);
httpAPI.addAdminHandler(semaforoSeoHandler);
// Common
let newsCommonHandler = new common_1.NewsCommonHandler(newsUC);
httpAPI.addHandler(newsCommonHandler);
let searchHandler = new http_4.SearchHandler(searchUC);
httpAPI.addHandler(searchHandler);
// SIEMPRE QUE SE INICIALIZE SE TENDRA LA VERSION DE LAS TABLAS CORRECTA,
// USAR SOLO EN DEVELOPMENT
appDataSource.initialize()
    .then(() => {
    // RUN HTTP API
    httpAPI.run();
})
    .catch(err => {
    console.log(err);
});
