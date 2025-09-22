// decoradores en TypeScript (muy común en frameworks como TypeORM, InversifyJS, NestJS, routing-controllers, class-validator, etc.). Definir esquemas de entidades (TypeORM).
import "reflect-metadata"

require('dotenv').config()

import fs from "fs";
import { HttpAPI } from './src/app/delivery/http';
import { DataSource } from "typeorm";

// NEWS
import { NewsORM, ORMNewsRepository } from './src/news/repository/orm';
import { NewsAdminHandler } from './src/news/delivery/admin';
import { NewsCommonHandler } from './src/news/delivery/common';
import { NewsCRUDUC } from './src/news/usecase/crud';
import { NewsCommonUC } from './src/news/usecase/common';

// NEWSContent
import { NewsContentORM, ORMNewsContentRepository } from './src/news_content/repository/orm';
import { NewsContentHandler } from './src/news_content/delivery/http';
import { NewsContentCRUDUC } from './src/news_content/usecase/crud';

// Users
import { UserORM, ORMUserRepository } from './src/user/repository/orm';
import { UserHandler } from './src/user/delivery/http';
import { UserCRUDUC } from './src/user/usecase/crud';

// SEARCH
import { SearchHandler } from './src/search/delivery/http';
import { SearchCRUDUC } from './src/search/usecase/crud';

// SEMAFORO SEO
import { SemaforoSeoHandler } from './src/semaforo_seo/delivery/http';
import { SemaforoSeoCRUDUC } from './src/semaforo_seo/usecase/crud';

// Config
import {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_DATABASE,
} from './src/config';

// Database Initialization
// INICIAR LA BD CON LA SELECCION DE DOTENV
const appDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST ?? "localhost",
    port: DB_PORT ?? 3306,
    username: DB_USER ?? "",
    password: DB_PASSWORD ?? "",
    database: DB_DATABASE ?? "articles_editor_db",
    synchronize: false, // en produccion debe ser falso, ponerlo en true solo cuando queramos migrar desde 0 la BD
    logging: true,
    entities: [
        NewsORM,
        NewsContentORM,
        UserORM,
    ],
    subscribers: [],
    migrations: [],
    charset: "utf8mb4_unicode_ci",
})

// Repositories Initialization
let newsRepo = new ORMNewsRepository(appDataSource);
let newsContentRepo = new ORMNewsContentRepository(appDataSource);
let userRepo = new ORMUserRepository(appDataSource);


// VERIFICAR MIGRACIÓN
// configurationRepo.migrate();


// Usecases Initialization
let newsAdminUC = new NewsCRUDUC(newsRepo, newsContentRepo);
let newsUC = new NewsCommonUC(newsRepo, newsContentRepo);

let newsContentUC = new NewsContentCRUDUC(newsRepo, newsContentRepo);

let userUC = new UserCRUDUC(userRepo);

let searchUC = new SearchCRUDUC(newsRepo, newsContentRepo);

let semaforoSeoUC = new SemaforoSeoCRUDUC();

// API Initialization
let privateKey  = fs.readFileSync('certs/server.key', 'utf8');
let certificate = fs.readFileSync('certs/server.crt', 'utf8');

let credentials = { key: privateKey, cert: certificate };
const port = 5000;

const httpAPI = new HttpAPI(port,/*  null */ credentials);

// HTTP Delivery Initialization
// Admin
let newsAdminHandler = new NewsAdminHandler(newsAdminUC, userUC)
httpAPI.addAdminHandler(newsAdminHandler);

let newsContentHandler = new NewsContentHandler(newsContentUC, userUC)
httpAPI.addAdminHandler(newsContentHandler);

let userHandler = new UserHandler(userUC)
httpAPI.addAdminHandler(userHandler);

let semaforoSeoHandler = new SemaforoSeoHandler(semaforoSeoUC)
httpAPI.addAdminHandler(semaforoSeoHandler);


// Common
let newsCommonHandler = new NewsCommonHandler(newsUC)
httpAPI.addHandler(newsCommonHandler);

let searchHandler = new SearchHandler(searchUC)
httpAPI.addHandler(searchHandler);


// SIEMPRE QUE SE INICIALIZE SE TENDRA LA VERSION DE LAS TABLAS CORRECTA,
// USAR SOLO EN DEVELOPMENT
appDataSource.initialize()
    .then( () => {
        // RUN HTTP API
        httpAPI.run();
    })
    .catch(err => {
        console.log(err)
    });
